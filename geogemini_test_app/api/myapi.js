// api/myapi.js

const fetch = require("node-fetch");

module.exports = async (req, res) => {
    // 環境変数からAPIキーを取得
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // リクエストパラメータから位置情報を取得
    const { lat, lng } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    try {
        // Google Maps Street View APIのリクエストURL
        const url = `https://maps.googleapis.com/maps/api/streetview?size=300x200&location=${lat},${lng}&key=${apiKey}`;
        
        // APIにリクエストを送信
        const response = await fetch(url);
        const imageUrl = response.url; // 画像のURLを取得

        // クライアントに画像URLを返す
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch the image" });
    }
};
