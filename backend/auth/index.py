"""
Авторизация пользователей: регистрация, вход, получение профиля, выход.
"""
import json
import os
import hashlib
import secrets
import psycopg2


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    # action через query: ?action=register  или через body JSON field "action"
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    if not action and method in ("POST", "PUT"):
        try:
            body_raw = json.loads(event.get("body") or "{}")
            action = body_raw.get("action", "")
        except Exception:
            body_raw = {}
    action = action.lower()

    conn = get_conn()
    cur = conn.cursor()
    s = schema()

    try:
        # POST /auth/register
        if action == "register" and method == "POST":
            body = json.loads(event.get("body") or "{}")
            username = (body.get("username") or "").strip()
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""

            if not username or not email or not password:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все поля"})}
            if len(password) < 6:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

            cur.execute(f"SELECT id FROM {s}.users WHERE email=%s OR username=%s", (email, username))
            if cur.fetchone():
                return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Email или имя уже занято"})}

            token = secrets.token_hex(32)
            pw_hash = hash_password(password)
            cur.execute(
                f"INSERT INTO {s}.users (username, email, password_hash, session_token) VALUES (%s,%s,%s,%s) RETURNING id, username, email",
                (username, email, pw_hash, token)
            )
            row = cur.fetchone()
            conn.commit()
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({"ok": True, "token": token, "user": {"id": row[0], "username": row[1], "email": row[2]}})
            }

        # POST /auth/login
        if action == "login" and method == "POST":
            body = json.loads(event.get("body") or "{}")
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""

            cur.execute(f"SELECT id, username, email, password_hash FROM {s}.users WHERE email=%s", (email,))
            row = cur.fetchone()
            if not row or row[3] != hash_password(password):
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

            token = secrets.token_hex(32)
            cur.execute(f"UPDATE {s}.users SET session_token=%s WHERE id=%s", (token, row[0]))
            conn.commit()
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({"ok": True, "token": token, "user": {"id": row[0], "username": row[1], "email": row[2]}})
            }

        # GET /auth/me  (X-Session-Token header)
        if action == "me" and method == "GET":
            token = event.get("headers", {}).get("X-Session-Token", "")
            if not token:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}
            cur.execute(f"SELECT id, username, email FROM {s}.users WHERE session_token=%s", (token,))
            row = cur.fetchone()
            if not row:
                return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": json.dumps({"ok": True, "user": {"id": row[0], "username": row[1], "email": row[2]}})
            }

        # POST /auth/logout
        if action == "logout" and method == "POST":
            token = event.get("headers", {}).get("X-Session-Token", "")
            if token:
                cur.execute(f"UPDATE {s}.users SET session_token=NULL WHERE session_token=%s", (token,))
                conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}

    finally:
        cur.close()
        conn.close()