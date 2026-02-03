// Database Operations
class Database {
  
  async getBooks() {
    try {
      const { data, error } = await supabaseClient
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      return [];
    }
  }

  async getFeaturedBooks() {
    try {
      const { data, error } = await supabaseClient
        .from('books')
        .select('*')
        .eq('featured', true)
        .limit(6);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return [];
    }
  }

  async getCart(userId) {
    try {
      const { data, error } = await supabaseClient
        .from('cart_items')
        .select(`
          *,
          books (
            id,
            title,
            author,
            price,
            cover_image
          )
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      return [];
    }
  }

  async addToCart(userId, bookId, quantity = 1) {
    const { data, error } = await supabaseClient
      .from('cart_items')
      .upsert({
        user_id: userId,
        book_id: bookId,
        quantity: quantity
      }, {
        onConflict: 'user_id,book_id'
      });
    
    if (error) throw error;
    return data;
  }

  async removeFromCart(userId, bookId) {
    const { error } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);
    
    if (error) throw error;
  }

  async clearCart(userId) {
    const { error } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  // Order operations
  async createOrder(userId, orderData) {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          user_id: userId,
          order_number: orderNumber,
          total_amount: orderData.total,
          shipping_address: orderData.address,
          payment_method: orderData.paymentMethod,
          status: 'confirmed'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;

      // Add order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        book_id: item.book_id,
        quantity: item.quantity,
        price: item.books.price
      }));

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;

      // Clear cart
      await this.clearCart(userId);
      
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getUserOrders(userId) {
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            books (
              title,
              author,
              cover_image
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Profile operations
  async getProfile(userId) {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

// Initialize database
const db = new Database();