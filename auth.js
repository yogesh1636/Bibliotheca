// Authentication Functions
class Auth {
  constructor() {
    this.user = null;
    this.checkAuthState();
  }

  async checkAuthState() {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      this.user = user;
      this.updateUI();
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  }

  async signUp(email, password, fullName) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        console.error('❌ Signup error:', error);
        throw error;
      }
      
      if (data.user && !data.session) {
        this.showToast('✅ Account created! Check your email for verification.', 'success');
      } else if (data.user && data.session) {
        this.showToast('✅ Account created and signed in successfully!', 'success');
        this.user = data.user;
        this.updateUI();
      }
      
      return data;
    } catch (error) {
      let errorMessage = 'Signup failed: ';
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Try signing in instead.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message.includes('email')) {
        errorMessage = 'Please enter a valid email address.';
      } else {
        errorMessage += error.message;
      }
      
      this.showToast(errorMessage, 'error');
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      this.user = data.user;
      this.updateUI();
      this.showToast(`✅ Welcome back, ${data.user.user_metadata?.full_name || data.user.email}!`, 'success');
      return data;
    } catch (error) {
      this.showToast('❌ Invalid email or password', 'error');
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      this.user = null;
      this.updateUI();
      localStorage.removeItem('cart');
      this.showToast('✅ Signed out successfully', 'info');
    } catch (error) {
      this.showToast('❌ Error signing out', 'error');
    }
  }

  // Toast notification helper
  showToast(message, type = 'info') {
    if (typeof showToast === 'function') {
      showToast(message, type);
    } else {
      // Fallback to alert if toast function not available
      alert(message);
    }
  }

  updateUI() {
    const authBtn = document.getElementById('authBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (this.user) {
      if (authBtn) authBtn.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'block';
        userMenu.innerHTML = `
          <div class="relative">
            <button onclick="toggleUserMenu()" class="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
              <span>Hi, ${this.user.user_metadata?.full_name || this.user.email}</span>
              <span>▼</span>
            </button>
            <div id="userDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
              <a href="profile.html" class="block px-4 py-2 hover:bg-indigo-50">Profile</a>
              <a href="orders.html" class="block px-4 py-2 hover:bg-indigo-50">Orders</a>
              <button onclick="auth.signOut()" class="block w-full text-left px-4 py-2 hover:bg-indigo-50">Logout</button>
            </div>
          </div>
        `;
      }
    } else {
      if (authBtn) authBtn.style.display = 'block';
      if (userMenu) userMenu.style.display = 'none';
    }
  }
}

// Initialize auth
const auth = new Auth();

// Auth modal functions
function showAuthModal() {
  document.getElementById('authModal').classList.remove('hidden');
}

function hideAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}

function toggleAuthMode() {
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  
  signInForm.classList.toggle('hidden');
  signUpForm.classList.toggle('hidden');
}

function toggleUserMenu() {
  document.getElementById('userDropdown').classList.toggle('hidden');
}

// Form handlers
async function handleSignIn(event) {
  event.preventDefault();
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;
  
  await auth.signIn(email, password);
  hideAuthModal();
}

async function handleSignUp(event) {
  event.preventDefault();
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;
  const fullName = document.getElementById('signUpName').value;
  
  await auth.signUp(email, password, fullName);
  hideAuthModal();
}

// Listen for auth changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    auth.user = session.user;
    auth.updateUI();
  } else if (event === 'SIGNED_OUT') {
    auth.user = null;
    auth.updateUI();
  }
});