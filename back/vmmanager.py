# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, Blueprint
from config import HOSTS
from preparessh import sshClients, sshConnect
import json, paramiko
vmmanager = Blueprint('vmmanager', __name__)


@vmmanager.route('/getHosts')
def getHost():
    return json.dumps(HOSTS)


@vmmanager.route("/getContainerList", methods=['POST'])
def getContainerList():
    hostip = request.form.get("hostip")
    client = sshClients.get(hostip)
    if not client:
        return json.dumps({"error":"没找到ssh客户的, 请检查ssh状态."})
    if client["status"] == "connected":
        client = client["client"]
    else:
        return json.dumps({"error":"ssh客户端状态异常, 请检查ssh状态."})
    stdin, stdout, stderr = client.exec_command('lxc-ls -f')
    resp = {"result":[]}
    cnt = 0
    for std in stdout.readlines():
        cnt = cnt+1
        if cnt > 2: #前两行无用
            std = std.split(" ")
            std = [x for x in std if x]
            resp["result"].append({
                "key":cnt,
                "name":std[0],
                "state":std[1],
                "ip":std[2],
                "autostart":std[-2],
            })
    return json.dumps(resp)


@vmmanager.route("/getSSHState")
def getSSHState():
    global sshClients
    result = []
    for k,v in sshClients.iteritems():
        result.append({
            "ip":k,
            "status":v["status"]
        })
    return json.dumps({"result":result})


@vmmanager.route("/reconnectSSH")
def reconnectSSH():
    global sshClients
    sshClients = {}
    sshConnect()
    return json.dumps({"result":"success"})


@vmmanager.route("/op", methods=["POST"])
def op():
    global sshClients
    hostip = request.form.get("hostip")
    name = request.form.get("name")
    flag = request.form.get("flag")
    client = sshClients.get(hostip)
    if not client:
        return json.dumps({"error":"没找到ssh客户的, 请检查ssh状态."})
    if client["status"] == "connected":
        client = client["client"]
    else:
        return json.dumps({"error":"ssh客户端状态异常, 请检查ssh状态."})
    stderr = None
    stdout = None
    if(flag == "up"):
        stdin, stdout, stderr = client.exec_command('lxc-start -n %s -d' %name)
    elif(flag == "down"):
        stdin, stdout, stderr = client.exec_command('lxc-stop -n %s' %name)
    elif(flag=="del"):
        stdin, stdout, stderr = client.exec_command('lxc-destroy -n %s' %name)
    stdout.read()
    error = stderr.read()
    if error:
        return json.dumps({"error":error})
    else:
        return json.dumps({"result":"success"})


@vmmanager.route("/createContainer", methods=["POST"])
def createContainer():
    global sshClients
    hostip = request.form.get("hostip")
    name = request.form.get("name")
    ip = request.form.get("ip")
    vnet = request.form.get("vnet")
    gateway = request.form.get("gateway")
    client = sshClients.get(hostip)
    if not client:
        return json.dumps({"error":"没找到ssh客户的, 请检查ssh状态."})
    if client["status"] == "connected":
        client = client["client"]
    else:
        return json.dumps({"error":"ssh客户端状态异常, 请检查ssh状态."})
    stdin, stdout, stderr = client.exec_command('cd /var/lib/lxc;. deploy.sh %s %s %s %s' %(name, vnet, ip, gateway))
    stdout.read()
    error = stderr.read()
    if error:
        return json.dumps({"error":error})
    else:
        return json.dumps({"result":"success"})

@vmmanager.route("/copy", methods=["POST"])
def copy():
    global sshClients
    post = request.form
    client = sshClients.get(post["toHostip"])
    if not client:
        return json.dumps({"error":"没找到ssh客户的, 请检查ssh状态."})
    if client["status"] == "connected":
        client = client["client"]
    else:
        return json.dumps({"error":"ssh客户端状态异常, 请检查ssh状态."})
    username = None
    passwd = None
    for host in HOSTS:
        if host["ip"] == post["fromHostip"]:
            user = host["user"]
            passwd = host["passwd"]
            break
    stdin, stdout, stderr = client.exec_command('scp -r %s@%s:/var/lib/lxc/%s /var/lib/lxc/%s' %(user, post["toHostip"], post["fromName"], post["toName"]))
    print stdout.read()
    print stderr.read()
    stdin, stdout, stderr = client.exec_command(passwd)
    print stdout.read()
    print stderr.read()
    stdin, stdout, stderr = client.exec_command('sed -i s/%s/%s/ /var/lib/lxc/%s/config' %(post["fromName"],post["toName"],post["toName"]))
    print stdout.read()
    print stderr.read()
    stdin, stdout, stderr = client.exec_command('sed -i s/%s/%s/ /var/lib/lxc/%s/rootfs/etc/network/interfaces' %(post["fromIp"],post["toIp"],post["toIp"]))
    print stdout.read()
    print stderr.read()
    return json.dumps({"result":"success"})
