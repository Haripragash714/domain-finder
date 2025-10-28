from flask import Flask, request, jsonify
from flask_cors import CORS
import whois

app = Flask(__name__)
CORS(app)

@app.route("/check", methods=["POST"])
def check_domain():
    data = request.get_json()
    domain = data.get("domain", "").strip().lower()

    if not domain:
        return jsonify({"error": "Domain name is required"}), 400

    try:
        w = whois.whois(domain)
        # If WHOIS returns domain_name, it is TAKEN
        available = False if w.domain_name else True
    except Exception:
        # WHOIS lookup failed — assume available (not registered)
        available = True

    return jsonify({
        "domain": domain,
        "available": available
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

