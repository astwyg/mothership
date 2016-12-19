# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, redirect, make_response
import urllib2,urllib
import cookielib
import json
from back.vmmanager import vmmanager
from back.command import command
from back.preparessh import sshConnect
from back.config import SERVERDEBUG,FRONTDEBUG

import sys
reload(sys)
sys. setdefaultencoding('utf8')

app = Flask(__name__, static_folder='front')

app.register_blueprint(vmmanager, url_prefix='/vm')
app.register_blueprint(command, url_prefix='/command')

@app.route("/")
def index():
    return redirect("/vm")

@app.route("/vm")
def vmmanage():
    return render_template('vmmanage.html', debugMode=FRONTDEBUG)

@app.route("/command")
def command():
    return render_template('command.html', debugMode=FRONTDEBUG)


if __name__ == '__main__':
    sshConnect()
    app.run(debug=SERVERDEBUG, port=5001, host="0.0.0.0")