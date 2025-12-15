import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get('action');

        // Construct the external URL with the query parameter if it exists
        let externalUrl = 'https://fleek-authority-n8n.9cdpsl.easypanel.host/webhook/e93f45ef-f8e4-4da2-aae1-4ccdbd9cc294/chat';
        if (action) {
            externalUrl += `?action=${action}`;
        }

        const response = await fetch(externalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`External API responded with ${response.status}: ${response.statusText}`);
        }

        // Get the response text first
        const dataText = await response.text();

        // Try to parse it as JSON
        let data;
        try {
            data = JSON.parse(dataText);
        } catch {
            // If it's not JSON (e.g. streaming or plain text), return as text or handle accordingly
            // For n8n chat, it usually returns JSON array of messages
            data = dataText;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json(
            { error: 'Failed to proxy request' },
            { status: 500 }
        );
    }
}
