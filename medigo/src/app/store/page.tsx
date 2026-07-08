"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Pill, Search, ShoppingBag, Plus, Minus, X, CreditCard } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { show } = useToast();
  
  // Cart state
  const [cart, setCart] = useState<{product: any, quantity: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay">("Razorpay");
  
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get('/api/v1/products');
        if (res.success && res.data) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
    
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const addToCart = (product: any) => {
    const exists = cart.find(item => item.product.id === product.id);
    if (exists) {
      show("Increased quantity in cart", "success");
    } else {
      show("Added to cart", "success");
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!addressDetails.fullName || !addressDetails.street || !addressDetails.city || !addressDetails.state || !addressDetails.zipCode || !addressDetails.phone) {
      show("Please fill out all shipping address fields", "error");
      return;
    }
    
    setIsCheckingOut(true);
    try {
      show("Verifying membership...", "info");
      const eligibilityRes = await api.get("/api/v1/orders/check-eligibility");
      
      if (!eligibilityRes.success || !eligibilityRes.data?.eligible) {
        show("Membership Required! Please buy a membership plan first to purchase medications.", "error");
        setIsCartOpen(false);
        router.push("/pricing");
        return;
      }
      show("Membership verified!", "success");

      const shippingAddress = `${addressDetails.fullName}, ${addressDetails.street}, ${addressDetails.city}, ${addressDetails.state} ${addressDetails.zipCode}. Ph: ${addressDetails.phone}`;
      
      const items = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }));

      if (paymentMethod === "COD") {
        show("Placing COD order...", "info");
        const orderRes = await api.post("/api/v1/orders/checkout", {
          items,
          shippingAddress,
          paymentMethod: "COD"
        });

        if (orderRes.success) {
          show("Order placed successfully via Cash on Delivery!", "success");
          setCart([]);
          setIsCartOpen(false);
          router.push("/dashboard/patient?tab=orders");
        } else {
          throw new Error("Failed to place COD order");
        }
        return;
      }

      // 1. Create Razorpay order
      const orderRes = await api.post("/api/v1/payments/create-order", { amount: cartTotal, currency: "INR" });
      if (!orderRes.success) throw new Error("Failed to create order");
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourKey",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "MediGo Pharmacy",
        description: "Payment for Medications",
        order_id: orderRes.data.id,
        handler: async function (response: any) {
          try {
            show("Verifying payment...", "info");
            
            // 2. Verify payment and create DB order
            const verifyRes = await api.post("/api/v1/orders/checkout", {
              items,
              shippingAddress,
              paymentMethod: "Razorpay",
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes) {
              show("Order placed successfully!", "success");
              setCart([]);
              setIsCartOpen(false);
              // Redirect to patient dashboard or orders page
              router.push("/dashboard/patient?tab=orders");
            }
          } catch (error: any) {
            console.error(error);
            show(error.message || "Payment verification failed", "error");
          }
        },
        theme: {
          color: "#059669",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        show(response.error.description || "Payment failed", "error");
      });
      rzp.open();
      
    } catch (error: any) {
      console.error(error);
      show(error.message || "Checkout failed", "error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
              MediGo Store
            </h1>
            <p className="text-text-secondary mt-2">
              Premium, clinically proven weight loss medications.
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input 
                type="text" 
                placeholder="Search medicines..." 
                className="w-full md:w-64 pl-10 pr-4 py-2 rounded-full border border-border focus:outline-none focus:border-primary/50 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-white border border-border hover:bg-primary-50 transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-text-primary" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-6 rounded-2xl bg-white border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <div className="w-full h-48 mb-4 rounded-xl flex items-center justify-center overflow-hidden bg-transparent p-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-md" />
                  ) : (
                    <Pill className="w-12 h-12 text-primary-200" />
                  )}
                </div>

                <div className="text-left flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-50 px-2 py-0.5 rounded-full">
                    {product.category || "Weight Loss"}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-bold text-text-primary leading-tight">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-text-secondary text-sm line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-xl">₹{product.price}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => addToCart(product)}
                    variant="outline"
                    className="flex-1 shadow-sm hover:shadow-md transition-all font-bold border-border"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => {
                      // If it's already in the cart, just open the drawer.
                      // If not, add it and open drawer.
                      const exists = cart.find(item => item.product.id === product.id);
                      if (!exists) {
                        setCart(prev => [...prev, { product, quantity: 1 }]);
                      }
                      setIsCartOpen(true);
                    }}
                    variant="primary"
                    className="flex-1 shadow-md hover:shadow-lg transition-all font-bold"
                  >
                    Buy Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-out Cart */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
                  <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 p-4 border border-border rounded-xl bg-background">
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <Pill className="w-8 h-8 text-primary-200" />
                      )}
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-text-primary text-sm line-clamp-2">{item.product.name}</h4>
                        <p className="text-primary font-bold mt-1">₹{item.product.price}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-2 bg-white border border-border w-fit rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="text-text-tertiary hover:text-text-primary">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="text-text-tertiary hover:text-text-primary">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {cart.length > 0 && (
                <div className="mt-4 space-y-6">
                  {/* Shipping Address Section inside scrollable area */}
                  <div>
                    <h3 className="block text-sm font-bold text-text-primary mb-3">Shipping Address</h3>
                    <div className="space-y-3">
                      <input 
                        type="text"
                        className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                        placeholder="Full Name"
                        value={addressDetails.fullName}
                        onChange={(e) => setAddressDetails(p => ({ ...p, fullName: e.target.value }))}
                      />
                      <input 
                        type="text"
                        className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                        placeholder="Street Address (House No, Area)"
                        value={addressDetails.street}
                        onChange={(e) => setAddressDetails(p => ({ ...p, street: e.target.value }))}
                      />
                      <div className="flex gap-3">
                        <input 
                          type="text"
                          className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                          placeholder="City"
                          value={addressDetails.city}
                          onChange={(e) => setAddressDetails(p => ({ ...p, city: e.target.value }))}
                        />
                        <input 
                          type="text"
                          className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                          placeholder="State"
                          value={addressDetails.state}
                          onChange={(e) => setAddressDetails(p => ({ ...p, state: e.target.value }))}
                        />
                      </div>
                      <div className="flex gap-3">
                        <input 
                          type="text"
                          className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                          placeholder="PIN / ZIP Code"
                          value={addressDetails.zipCode}
                          onChange={(e) => setAddressDetails(p => ({ ...p, zipCode: e.target.value }))}
                        />
                        <input 
                          type="text"
                          className="w-full border border-border rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                          placeholder="Phone Number"
                          value={addressDetails.phone}
                          onChange={(e) => setAddressDetails(p => ({ ...p, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section inside scrollable area */}
                  <div>
                    <h3 className="block text-sm font-bold text-text-primary mb-3">Payment Method</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setPaymentMethod("Razorpay")}
                        className={`flex-1 p-3 rounded-xl border text-sm font-bold transition-all ${
                          paymentMethod === "Razorpay" 
                            ? "bg-primary-50 border-primary text-primary" 
                            : "bg-white border-border text-text-secondary hover:bg-slate-50"
                        }`}
                      >
                        Pay Online (UPI / Card)
                      </button>
                      <button
                        onClick={() => setPaymentMethod("COD")}
                        className={`flex-1 p-3 rounded-xl border text-sm font-bold transition-all ${
                          paymentMethod === "COD" 
                            ? "bg-primary-50 border-primary text-primary" 
                            : "bg-white border-border text-text-secondary hover:bg-slate-50"
                        }`}
                      >
                        Cash on Delivery
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t border-border bg-background flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-text-secondary">Total</span>
                  <span className="text-2xl font-bold font-heading text-text-primary">₹{cartTotal.toFixed(2)}</span>
                </div>
                <Button 
                  onClick={handleCheckout}
                  variant="primary" 
                  fullWidth 
                  className="py-4 text-lg font-bold flex items-center justify-center gap-2"
                  disabled={isCheckingOut}
                >
                  <CreditCard className="w-5 h-5" />
                  {isCheckingOut ? "Processing..." : (paymentMethod === "COD" ? "Place Order" : "Checkout via Razorpay")}
                </Button>
                <p className="text-[10px] text-text-tertiary text-center mt-3 leading-tight">
                  Note: A valid prescription and membership are required to process this order.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
