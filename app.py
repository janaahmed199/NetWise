from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.json

    name = data.get("name")
    phone = data.get("phone")

    package = float(data.get("package", 0))
    used = float(data.get("used", 0))
    days_left = int(data.get("days_left", 0))

    remaining = max(package - used, 0)

    if days_left > 0:
        daily_limit = remaining / days_left
    else:
        daily_limit = 0

    return jsonify({
        "name": name,
        "phone": phone,
        "package": package,
        "used": used,
        "remaining": round(remaining, 2),
        "daily_limit": round(daily_limit, 2)
    })


@app.route("/action/block", methods=["POST"])
def block_internet():
    data = request.json

    phone = data.get("phone")

    return jsonify({
        "status": "success",
        "action": "BLOCK_INTERNET",
        "phone": phone,
        "message": "Internet access has been blocked successfully."
    })


if __name__ == "__main__":
    app.run(debug=True)
