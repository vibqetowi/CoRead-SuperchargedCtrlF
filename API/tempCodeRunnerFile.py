flask_thread = threading.Thread(target=run_app)
flask_thread.start()

# Open an ngrok tunnel to the HTTP server
public_url = ngrok.connect(5000)
print(" * ngrok tunnel \"{}\" -> \"http://127.0.0.1:5000\"".format(public_url))