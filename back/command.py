# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, Blueprint
import json, paramiko
import paramiko
from back.config import *

command = Blueprint('command', __name__)

@command.route('/run', methods=['POST'])
def getHost():
    target = request.form.get("target")
    order = request.form.get("order")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(ANSIBLE_ADMIN_HOST, 22, ANSIBLE_ADMIN_USER, ANSIBLE_ADMIN_PASSWD, timeout=4)
    stdin, stdout, stderr = client.exec_command('/root/env/bin/ansible -i "{}" all -a "{}"'.format(target, order))
    out = stdout.read()
    error = stderr.read()
    return error or out