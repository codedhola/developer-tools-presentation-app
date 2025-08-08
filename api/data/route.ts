import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (use a real database in production)
let dataStore: any[] = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    dataStore.push(data)
    
    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json(dataStore)
}
