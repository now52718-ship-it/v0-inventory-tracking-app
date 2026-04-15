// Seed sample data into Supabase for testing
// Run this once to populate your database with test data
import { supabase } from './supabaseClient'

export async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data...')

    // 1. Create sample products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert([
        { name: '769XR XPON Router', category: 'Router' },
        { name: 'Nokia ONU', category: 'ONU' },
        { name: 'Mikrotik 951', category: 'Router' },
        { name: 'Black ONT', category: 'ONT' },
        { name: 'Fiber Connectors', category: 'Consumable' },
        { name: 'D-Link Router', category: 'Router' },
        { name: 'Sig. Connect ONT 122XR', category: 'ONT' },
      ])
      .select()

    if (productsError) {
      console.warn('Could not seed products:', productsError.message)
    } else {
      console.log('✅ Created sample products')
    }

    // 2. Create sample items (with serial numbers)
    const productIds = productsData?.map(p => p.id) || []
    if (productIds.length > 0) {
      const { error: itemsError } = await supabase
        .from('items')
        .insert([
          { serial_number: 'XPONDD87A2D2', product_id: productIds[0], status: 'IN_STORE' },
          { serial_number: 'XPONDD87A3A2', product_id: productIds[0], status: 'IN_FIELD', assigned_to: 'Fred' },
          { serial_number: 'NK-ONU-001', product_id: productIds[1], status: 'IN_STORE' },
          { serial_number: 'HKB0AMS5SH3', product_id: productIds[2], status: 'RETURNED' },
          { serial_number: 'ALCLF9DE9961', product_id: productIds[3], status: 'FAULTY' },
        ])

      if (itemsError) {
        console.warn('Could not seed items:', itemsError.message)
      } else {
        console.log('✅ Created sample items')
      }
    }

    // 3. Create sample activity logs
    const { error: activityError } = await supabase
      .from('activity_logs')
      .insert([
        {
          user_name: 'Mr Isaac',
          action: 'LOGIN',
          description: 'Mr Isaac logged into the system',
        },
        {
          user_name: 'Mr Isaac',
          action: 'ADD_STOCK',
          description: 'Mr Isaac added XPON Routers to stock',
        },
        {
          user_name: 'Fred',
          action: 'LOGIN',
          description: 'Fred logged into the system',
        },
        {
          user_name: 'Fred',
          action: 'ISSUE_ITEM',
          serial_number: 'XPONDD87A3A2',
          description: 'Fred issued XPONDD87A3A2 to customer',
        },
      ])

    if (activityError) {
      console.warn('Could not seed activities:', activityError.message)
    } else {
      console.log('✅ Created sample activity logs')
    }

    console.log('✨ Sample data seeding complete!')
    return true
  } catch (error) {
    console.error('Error seeding data:', error)
    return false
  }
}

// Run this to clear all data (careful!)
export async function clearAllData() {
  try {
    console.log('⚠️ Clearing all data...')

    await supabase.from('activity_logs').delete().neq('id', '')
    await supabase.from('transactions').delete().neq('id', '')
    await supabase.from('items').delete().neq('id', '')
    await supabase.from('products').delete().neq('id', '')

    console.log('✅ All data cleared')
  } catch (error) {
    console.error('Error clearing data:', error)
  }
}
