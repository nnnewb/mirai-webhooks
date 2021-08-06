# mirai-webhooks

基于 oicq 项目的 webhook 通知工具。希望每个还在用 QQ 做主力办公工具的沙雕企业都能有朝一日换个正经点的办公平台。

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
