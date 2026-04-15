import { seedSampleData } from '@/lib/seedData'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const success = await seedSampleData()
    return NextResponse.json({
      success,
      message: success ? '✅ Sample data seeded successfully!' : '⚠️ Sample data seeding completed with warnings (check browser console)'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
