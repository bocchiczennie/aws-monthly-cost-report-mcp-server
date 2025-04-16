# MCPサーバー開発

## クイックスタートガイド Node.js 開発向け
[https://modelcontextprotocol.io/quickstart/server#node](https://modelcontextprotocol.io/quickstart/server#node)
- 上記URLを読んでMCPサーバーをClaude Desktopの準備をしておく

### システム要件
- Node.js バージョン 16 以上
- AWS CLI 2.23.3 （動作確認済み）

### 環境変数について
- `.env.sample` をベースに `.env` ファイルを作成する
```dotenv
# S3バケットが存在するリージョンを指定
AWS_REGION=ap-northeast-3
# AWS CLI ベースで操作するため、プロファイル設定をしている場合はプロファイル名を指定（デフォルトの場合は default）
AWS_PROFILE=default
# S3が存在するリージョンのエンドポイントを指定（東京の場合は https://s3.ap-northeast-1.amazonaws.com）
AWS_S3_ENDPOINT=https://s3.ap-northeast-3.amazonaws.com
# S3のバケット名を指定
AWS_COST_REPORT_BUCKET=your-backet-name
```

## npm インストール & ビルド
```bash
    npm install
    npm run build
```

### claude_desktop_config.json
```json
{
    "mcpServers": {
        "aws-monthly-cost-report": {
            "command": "node",
            "args": [
                "/path/to/aws-monthly-cost-report-mcp-server/build/index.js"
            ]
        }
    }
}
```

### プロンプト
```text
今月のAWSのコストを教えて
```