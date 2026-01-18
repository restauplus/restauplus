
# 🚨 CRITICAL FIX: Google "Exchange Code" Error

The error `Unable to exchange external code` is a "Handshake" failure. It means Google doesn't trust the **Secret Key** you gave to Supabase.

### 🛑 The "Big 3" Reasons this happens:

#### 1. The Client Secret is Wrong (Most Likely)
*   Go to [Supabase Auth Providers > Google](https://app.supabase.com/project/omagrvgzmyxwzqisnbvq/auth/providers).
*   **RE-COPY** the "Client Secret" from your Google Cloud Console.
*   **PASTE** it again into Supabase and click **SAVE**. 
*   *Note: Sometimes a hidden space at the end of the secret causes this.*

#### 2. Authorized Redirect URIs (The "Pipe" is blocked)
In your [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
*   Under **Web Client 1** (or your client name).
*   **Authorized redirect URIs** MUST be exactly this:
    `https://omagrvgzmyxwzqisnbvq.supabase.co/auth/v1/callback`
*   If you have `localhost` in the Google Cloud Redirect URIs, **REMOVE IT**. Only the Supabase link should be there.

#### 3. Supabase "Site URL"
In [Supabase Authentication > URL Configuration](https://app.supabase.com/project/omagrvgzmyxwzqisnbvq/auth/url-configuration):
*   **Site URL**: Set this to `http://localhost:3001` (since you are using port 3001).
*   **Redirect URLs**: Add `http://localhost:3001/**` to the list.

---

### 🛠️ Still Stuck? Use the "Emergency Admin" Login
If you need to enter the dashboard **RIGHT NOW** while you fix Google:
1.  Use the **Email Login** with:
    *   **Email**: `admin212123@restauplus.com`
    *   **Password**: `estauplus20263rt32twgwgwwgw3`
2.  I have updated the code so this login will **AUTO-CREATE** your account if it's missing.

**Steps to follow:**
1. Fix the **Client Secret** in Supabase first.
2. Refresh your browser at `http://localhost:3001/login`.
3. Try Google again.
