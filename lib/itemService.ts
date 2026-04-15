import { supabase } from './supabaseClient';
import { logScanQRActivity } from './activityLogService';

export interface Item {
  id: string;
  serial_number: string;
  product_id: string;
  status: 'IN_STORE' | 'IN_FIELD' | 'RETURNED' | 'FAULTY';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Scan QR code and fetch item details
 */
export async function scanQRCode(
  serialNumber: string,
  userId: string,
  userName: string
): Promise<Item | null> {
  try {
    // Log the scan activity
    await logScanQRActivity(userId, userName, serialNumber);

    // Fetch the item
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('serial_number', serialNumber)
      .single();

    if (error) {
      console.error('Error scanning QR code:', error);
      return null;
    }

    return data as Item;
  } catch (error) {
    console.error('Error scanning QR code:', error);
    return null;
  }
}

/**
 * Get item by serial number
 */
export async function getItemBySerialNumber(serialNumber: string): Promise<Item | null> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('serial_number', serialNumber)
      .single();

    if (error) {
      console.error('Error fetching item:', error);
      return null;
    }

    return data as Item;
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
}

/**
 * Get product details
 */
export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Issue item to customer
 */
export async function issueItem(
  serialNumber: string,
  productId: string,
  userId: string,
  userName: string,
  customerName: string
): Promise<boolean> {
  try {
    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        serial_number: serialNumber,
        product_id: productId,
        action: 'ISSUE_ITEM',
        user_id: userId,
        customer_name: customerName,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return false;
    }

    // Update item status
    const { error: updateError } = await supabase
      .from('items')
      .update({
        status: 'IN_FIELD',
        assigned_to: customerName,
        updated_at: new Date().toISOString(),
      })
      .eq('serial_number', serialNumber);

    if (updateError) {
      console.error('Error updating item status:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error issuing item:', error);
    return false;
  }
}

/**
 * Return item from customer
 */
export async function returnItem(
  serialNumber: string,
  productId: string,
  userId: string,
  userName: string,
  condition: 'GOOD' | 'DAMAGED'
): Promise<boolean> {
  try {
    const newStatus = condition === 'DAMAGED' ? 'FAULTY' : 'RETURNED';

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        serial_number: serialNumber,
        product_id: productId,
        action: 'RETURN_ITEM',
        user_id: userId,
        condition: condition,
      });

    if (transactionError) {
      console.error('Error creating return transaction:', transactionError);
      return false;
    }

    // Update item status
    const { error: updateError } = await supabase
      .from('items')
      .update({
        status: newStatus,
        assigned_to: null,
        updated_at: new Date().toISOString(),
      })
      .eq('serial_number', serialNumber);

    if (updateError) {
      console.error('Error updating item status:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error returning item:', error);
    return false;
  }
}

/**
 * Mark item as faulty
 */
export async function markItemAsFaulty(
  serialNumber: string,
  userId: string,
  userName: string
): Promise<boolean> {
  try {
    // Update item status
    const { error: updateError } = await supabase
      .from('items')
      .update({
        status: 'FAULTY',
        updated_at: new Date().toISOString(),
      })
      .eq('serial_number', serialNumber);

    if (updateError) {
      console.error('Error marking item as faulty:', updateError);
      return false;
    }

    // Create transaction record
    const item = await getItemBySerialNumber(serialNumber);
    if (item) {
      await supabase.from('transactions').insert({
        serial_number: serialNumber,
        product_id: item.product_id,
        action: 'MARK_FAULTY',
        user_id: userId,
      });
    }

    return true;
  } catch (error) {
    console.error('Error marking item as faulty:', error);
    return false;
  }
}

/**
 * Get all items for a product
 */
export async function getProductItems(productId: string): Promise<Item[]> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching product items:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching product items:', error);
    return [];
  }
}

/**
 * Get items by status
 */
export async function getItemsByStatus(
  status: 'IN_STORE' | 'IN_FIELD' | 'RETURNED' | 'FAULTY'
): Promise<Item[]> {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items by status:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching items by status:', error);
    return [];
  }
}
