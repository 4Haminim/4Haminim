import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Mail, Phone, MapPin, Clock, Gift, Check } from 'lucide-react';

const FourSpeciesApp = () => {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderForm, setOrderForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    email: '',
    phone: ''
  });
  const [emailVerification, setEmailVerification] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const packages = [
    {
      id: 1,
      name: 'כשר לברכה',
      price: 50,
      description: 'סט בסיסי כשר לברכה',
      includes: ['לולב', 'אתרוג', '3 הדסים', '2 ערבות', 'נרתיק'],
      options: {}
    },
    {
      id: 2,
      name: 'כשר למהדרין',
      price: 80,
      description: 'סט מהדרין איכותי',
      includes: ['לולב', 'אתרוג', '3 הדסים', '2 ערבות', 'נרתיק'],
      options: {
        lulav: ['לולב מזן דרי', 'לולב עם קורה'],
        etrog: ['אתרוג מזן חזון איש', 'אתרוג תימני']
      }
    },
    {
      id: 3,
      name: 'כשר מהודר ביותר',
      price: 150,
      description: 'סט מהודר ברמה הגבוהה ביותר',
      includes: ['לולב', 'אתרוג', '3 הדסים', '2 ערבות', 'נרתיק'],
      options: {
        lulav: ['לולב מזן דרי', 'לולב עם קורה'],
        etrog: ['אתרוג מזן חזון איש', 'אתרוג תימני']
      }
    }
  ];

  const additionalItems = [
    { id: 'hadassim-weiss', name: 'סט נוסף של הדסים כשרות הרב וייס', price: 20 },
    { id: 'hadassim-stern', name: 'הדסים כשרות הרב שטרן', price: 40 },
    { id: 'aravot', name: 'סט נוסף של ערבות', price: 5 }
  ];

  const addToCart = (packageId, options = {}) => {
    const package_ = packages.find(p => p.id === packageId);
    const cartItem = {
      id: Date.now(),
      package: package_,
      options,
      quantity: 1
    };
    setCart([...cart, cartItem]);
  };

  const addAdditionalItem = (itemId) => {
    const item = additionalItems.find(i => i.id === itemId);
    const existingItem = cart.find(c => c.additionalItem && c.additionalItem.id === itemId);
    
    if (existingItem) {
      setCart(cart.map(c => 
        c.id === existingItem.id 
          ? { ...c, quantity: c.quantity + 1 }
          : c
      ));
    } else {
      setCart([...cart, {
        id: Date.now(),
        additionalItem: item,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    const total = cart.reduce((sum, item) => {
      const price = item.package ? item.package.price : item.additionalItem.price;
      return sum + (price * item.quantity);
    }, 0);
    return total;
  };

  const getPackageCount = () => {
    return cart.filter(item => item.package).reduce((sum, item) => sum + item.quantity, 0);
  };

  const getFreeKvishLech = () => {
    return getPackageCount() >= 4;
  };

  const canAddAdditionalItems = () => {
    return cart.some(item => item.package);
  };

  const verifyEmail = () => {
    if (emailVerification === orderForm.email) {
      setIsEmailVerified(true);
    } else {
      alert('כתובת המייל אינה תואמת');
    }
  };

  const handleSubmit = () => {
    if (!isEmailVerified) {
      alert('נדרש אימות כתובת מייל');
      return;
    }
    
    // Validate all required fields
    if (!orderForm.firstName || !orderForm.lastName || !orderForm.address || 
        !orderForm.city || !orderForm.email || !orderForm.phone) {
      alert('יש למלא את כל השדות הנדרשים');
      return;
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCart([]);
      setShowCheckout(false);
      setOrderForm({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        email: '',
        phone: ''
      });
      setIsEmailVerified(false);
      setEmailVerification('');
    }, 3000);
  };

  const PackageSelector = ({ package_ }) => {
    const [selectedOptions, setSelectedOptions] = useState({});

    const handleOptionChange = (type, value) => {
      setSelectedOptions({ ...selectedOptions, [type]: value });
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200 hover:shadow-xl transition-all duration-300">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-amber-800 mb-2">{package_.name}</h3>
          <div className="text-3xl font-bold text-green-600 mb-2">₪{package_.price}</div>
          <p className="text-gray-600">{package_.description}</p>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-amber-700 mb-2">הסט כולל:</h4>
          <ul className="text-sm space-y-1">
            {package_.includes.map((item, idx) => (
              <li key={idx} className="flex items-center">
                <Check className="w-4 h-4 text-green-500 ml-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {package_.options.lulav && (
          <div className="mb-4">
            <label className="block font-medium text-amber-700 mb-2">בחר סוג לולב:</label>
            <select 
              className="w-full p-2 border border-amber-300 rounded"
              onChange={(e) => handleOptionChange('lulav', e.target.value)}
            >
              <option value="">בחר אופציה</option>
              {package_.options.lulav.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        {package_.options.etrog && (
          <div className="mb-4">
            <label className="block font-medium text-amber-700 mb-2">בחר סוג אתרוג:</label>
            <select 
              className="w-full p-2 border border-amber-300 rounded"
              onChange={(e) => handleOptionChange('etrog', e.target.value)}
            >
              <option value="">בחר אופציה</option>
              {package_.options.etrog.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={() => addToCart(package_.id, selectedOptions)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
        >
          הוסף לעגלה
        </button>
      </div>
    );
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">!הזמנה בוצעה בהצלחה</h2>
          <p className="text-lg text-gray-600">תודה רבה על ההזמנה! נחזור אליך בקרוב</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" dir="rtl">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🌿 ארבעת המינים 🍋</h1>
              <p className="text-xl opacity-90">המכירה האינטרנטית הגדולה של אזור המרכז עולה לירושלים</p>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowCheckout(true)}
                className="bg-white text-amber-600 p-3 rounded-full hover:bg-amber-50 transition-all duration-300 transform hover:scale-110"
              >
                <ShoppingCart className="w-6 h-6" />
              </button>
              {cart.length > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="bg-gradient-to-r from-green-100 to-yellow-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-8xl mb-4">🌿🍋🌿🍃</div>
          <h2 className="text-2xl font-semibold text-amber-800">ארבעת המינים כשרים ומהודרים לחג הסוכות</h2>
        </div>
      </div>

      {!showCheckout ? (
        <div className="container mx-auto px-4 py-8">
          {/* Important Info */}
          <div className="bg-red-50 border-r-4 border-red-400 p-4 mb-8 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-red-400 ml-2" />
              <p className="text-red-700 font-medium">
                <strong>חשוב!</strong> ההזמנות הינן עד לט' תשרי בשעה 10:00
              </p>
            </div>
          </div>

          {getFreeKvishLech() && (
            <div className="bg-green-50 border-r-4 border-green-400 p-4 mb-8 rounded-lg">
              <div className="flex items-center">
                <Gift className="w-5 h-5 text-green-400 ml-2" />
                <p className="text-green-700 font-medium">
                  <strong>מזל טוב!</strong> הזמנת 4 סטים ומעלה - זכאי לקבל קווישלך חינם!
                </p>
              </div>
            </div>
          )}

          {/* Packages */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {packages.map(package_ => (
              <PackageSelector key={package_.id} package_={package_} />
            ))}
          </div>

          {/* Additional Items */}
          {canAddAdditionalItems() && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-amber-800 mb-6 text-center">פריטים נוספים</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {additionalItems.map(item => (
                  <div key={item.id} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <h4 className="font-semibold text-amber-800 mb-2">{item.name}</h4>
                    <div className="text-xl font-bold text-green-600 mb-3">₪{item.price}</div>
                    <button
                      onClick={() => addAdditionalItem(item.id)}
                      className="w-full bg-amber-500 text-white py-2 px-4 rounded hover:bg-amber-600 transition-colors duration-300"
                    >
                      הוסף לעגלה
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-6">
            <h3 className="text-xl font-bold text-amber-800 mb-4 text-center">יצירת קשר ושאלות</h3>
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div className="flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-600 ml-2" />
                <span className="text-amber-800">faviv3@gmail.com</span>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="w-5 h-5 text-amber-600 ml-2" />
                <span className="text-amber-800">055-9650087</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Checkout */
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setShowCheckout(false)}
              className="mb-6 text-amber-600 hover:text-amber-800 transition-colors"
            >
              ← חזור לקניות
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-6">סיכום ההזמנה</h2>
              
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-200 py-4">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.package ? item.package.name : item.additionalItem.name}
                    </h3>
                    {item.options && Object.keys(item.options).length > 0 && (
                      <div className="text-sm text-gray-600">
                        {Object.entries(item.options).map(([key, value]) => (
                          <div key={key}>{value}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-green-500 hover:bg-green-50 rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="w-20 text-left font-medium">
                      ₪{(item.package ? item.package.price : item.additionalItem.price) * item.quantity}
                    </span>
                  </div>
                </div>
              ))}

              {getFreeKvishLech() && (
                <div className="flex justify-between items-center py-4 text-green-600">
                  <span>קווישלך חינם 🎁</span>
                  <span>₪0</span>
                </div>
              )}

              <div className="border-t border-gray-300 pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>סה"כ לתשלום:</span>
                  <span className="text-green-600">₪{getTotalPrice()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-amber-800 mb-6">פרטי ההזמנה</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="שם פרטי *"
                  required
                  value={orderForm.firstName}
                  onChange={(e) => setOrderForm({...orderForm, firstName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
                <input
                  type="text"
                  placeholder="שם משפחה *"
                  required
                  value={orderForm.lastName}
                  onChange={(e) => setOrderForm({...orderForm, lastName: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <input
                type="text"
                placeholder="כתובת מגורים *"
                required
                value={orderForm.address}
                onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 mb-4"
              />

              <input
                type="text"
                placeholder="עיר *"
                required
                value={orderForm.city}
                onChange={(e) => setOrderForm({...orderForm, city: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 mb-4"
              />

              <input
                type="email"
                placeholder="דואר אלקטרוני *"
                required
                value={orderForm.email}
                onChange={(e) => setOrderForm({...orderForm, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 mb-4"
              />

              <input
                type="tel"
                placeholder="מספר פלאפון *"
                required
                value={orderForm.phone}
                onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 mb-6"
              />

              {!isEmailVerified && orderForm.email && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-3">אימות כתובת מייל</h3>
                  <input
                    type="email"
                    placeholder="הקלד שוב את כתובת המייל לאימות"
                    value={emailVerification}
                    onChange={(e) => setEmailVerification(e.target.value)}
                    className="w-full p-2 border border-yellow-300 rounded mb-3"
                  />
                  <button
                    type="button"
                    onClick={verifyEmail}
                    className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
                  >
                    אמת מייל
                  </button>
                </div>
              )}

              {isEmailVerified && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 ml-2" />
                    <span>כתובת המייל אומתה בהצלחה</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isEmailVerified || cart.length === 0}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                בצע הזמנה - ₪{getTotalPrice()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FourSpeciesApp;