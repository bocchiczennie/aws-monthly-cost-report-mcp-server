# MCPサーバー開発

## クイックスタートガイド Node.js 開発向け
[https://modelcontextprotocol.io/quickstart/server#node](https://modelcontextprotocol.io/quickstart/server#node)
- 上記URLを読んでMCPサーバーをClaude Desktopの準備をしておく

### システム要件
- Node.js バージョン 16 以上
- AWS CLI 2.23.3 （動作確認済み）

### npm インストール & ビルド
```bash
    npm install
    npm run build
```

### claude_desktop_config.json
- `env` には環境変数を指定する
- 設定を変更したら、Claude Desktop を再起動する
```json
{
    "mcpServers": {
        "aws-monthly-cost-report": {
            "command": "node",
            "args": [
                "/path/to/aws-monthly-cost-report-mcp-server/build/index.js"
            ],
            "env": {
                "AWS_REGION": "ap-northeast-3",
                "AWS_PROFILE": "default",
                "AWS_S3_ENDPOINT": "https://s3.ap-northeast-3.amazonaws.com",
                "AWS_COST_REPORT_BUCKET": "your-backet-name"
            },
            "disabled": false,
            "autoApprove": [
                "get_env"
            ]
        }
    }
}
```

### プロンプト
```text
今月のAWSのコストを教えて
```