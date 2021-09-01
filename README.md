# mirai-webhooks

基于 oicq 项目的 webhook 通知工具。希望每个还在用 QQ 做主力办公工具的沙雕企业都能有朝一日换个正经点的办公平台。

## 警告

本项目仅用于学习，不做任何质量保证。

**在群里发通知可能导致账号被冻结**，可怜我以身试法，特此警告。给好友发私聊通知不容易挂（相对来说），挂了也别找我。

## features

- [x] Push 事件推送消息
- [x] Merge Request 事件推送消息
- [x] tag push 事件推送消息
- [x] Pipeline 事件推送消息
- [ ] Job 事件推送消息
- [ ] Issue 事件推送消息
- [ ] 初步 ChatOps 支持，通过消息创建 Issue、触发 Pipeline 等

## 使用

推荐用 docker，省事。

`.env` 可选，你要是用 docker-compose 部署的话把环境变量写到 `docker-compose.yml` 里也行。

`oicq-data` 一定要持久化，自己写个 volume 还是绑定一个本地路径都可以，不持久化的话每次登陆都会生成随机配置，服务器会验证设备锁什么的，个人觉得风控风险比较大。

```bash
docker run -it \
    -v "$(pwd)/config.yml:/app/config.yml" \
    -v "$(pwd)/oicq-data:/app/oicq-data" \
    -p 6543:6543 \
    uniqptr/mirai-webhooks
```

如果有自定义的消息模板可以把自己写的 templates 目录挂载进去，路径是 `/app/templates`。

## 配置

例子

```yaml
host: 0.0.0.0
port: 6543
logging:
  level: debug
notifiers:
  - type: mqtt
    config:
      broker: ws://192.168.2.175:9001
  - type: oicq
    config:
      uin: qq号
      pwd: 密码
      sendTo:
        - 要通知的qq号
        - 要通知的qq号
        - 要通知的qq号
      sendToGroups:
        - 要通知的qq群号
        - 要通知的qq群号
        - 要通知的qq群号
```
