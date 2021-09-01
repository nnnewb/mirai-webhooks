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
    -v "$(pwd)/.env:/app/.env" \
    -v "$(pwd)/oicq-data:/app/oicq-data" \
    -p 6543:6543 \
    uniqptr/mirai-webhooks
```

如果有自定义的消息模板可以把自己写的 templates 目录挂载进去，路径是 `/app/templates`。

## 配置

### 环境变量

支持 dotenv 形式配置环境变量。使用的环境变量一律以 `MIRAI_WEBHOOKS_` 开头。

```bash
MIRAI_WEBHOOKS_UIN=<你的QQ号>
MIRAI_WEBHOOKS_PWD=<你的QQ密码> # 不填写则使用扫码登陆，二维码会在终端打印出来
MIRAI_WEBHOOKS_PLATFORM=<平台协议> # 默认用安卓手机协议登陆，可以选择 1-5,分别是安卓手机、安卓平板、安卓手表、iPhone、iPad
MIRAI_WEBHOOKS_DATA_DIR=<oicq数据目录> # 不填写默认在 $(pwd)/oicq-data
MIRAI_WEBHOOKS_PORT=<监听端口号> # 默认在 6543
MIRAI_WEBHOOKS_HOSTNAME=<监听地址> # 默认在 127.0.0.1 ，自己看情况选择改成 0.0.0.0 或者别的
MIRAI_WEBHOOKS_ADMINISTRATOR=<管理员QQ号码> # 可以用命令管理机器人，你得先加机器人好友
MIRAI_WEBHOOKS_NOTIFY_GROUPS=<通知群列表> # webhooks 要通知的群列表
MIRAI_WEBHOOKS_NOTIFY_USERS=<通知人列表> # webhooks 要通知的人的列表，得先加机器人好友。
MIRAI_WEBHOOKS_FRIEND_SECRET=<加好友的密钥> # 不设置时机器人默认拒绝所有好友请求
MIRAI_WEBHOOKS_TEMPLATE_DIR=<通知消息模板目录> # 支持自定义通知消息模板，使用 mustache 模板引擎
```

例子

```bash
# .env
MIRAI_WEBHOOKS_UIN=1234567890
MIRAI_WEBHOOKS_PWD=Sup1rsEcR1t
```
