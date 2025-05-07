import React, { useState, useRef } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, ChevronUp, Trash2, RotateCcw, Save, Edit2, ShoppingCart, X } from 'lucide-react';
import DesignCanvas from './DesignCanvas';
import Checkout from './Checkout';

const DesignDashboard = ({ designs, setDesigns }) => {
  const predefinedRooms = [
    { id: 'living-room', name: 'Living Room', width: 12, height: 5, depth: 12, color: '#f0e8d0', wallTexture: 'patterned_concrete_wall_diff_1k.jpg' },
    { id: 'bedroom', name: 'Bedroom', width: 10, height: 4, depth: 10, color: '#e6e6fa', wallTexture: 'peeling_painted_wall_diff_1k.jpg' },
    { id: 'dining-room', name: 'Dining Room', width: 14, height: 6, depth: 14, color: '#f5f5f5', wallTexture: 'plaster_brick_pattern_diff_1k.jpg' },
  ];

  const wallTextures = [
    { id: 'patterned_concrete', name: 'Patterned Concrete', file: 'patterned_concrete_wall_diff_1k.jpg' },
    { id: 'peeling_painted', name: 'Peeling Painted', file: 'peeling_painted_wall_diff_1k.jpg' },
    { id: 'plaster_brick', name: 'Plaster Brick', file: 'plaster_brick_pattern_diff_1k.jpg' },
    { id: 'stone_tile', name: 'Stone Tile', file: 'stone_tile_wall_diff_1k.jpg' },
  ];

  const productCatalog = [
    {
      id: 'chair1',
      type: 'chair',
      name: 'Modern Wooden Chair',
      price: 99.99,
      image: '/images/chair.jpg',
      color: '#8B4513',
      shade: 50,
      scale: 1,
    },
    {
      id: 'table1',
      type: 'table',
      name: 'Oak Dining Table',
      price: 299.99,
      image: '/images/table.jpg',
      color: '#8B4513',
      shade: 50,
      scale: 1,
    },
    {
      id: 'sofa1',
      type: 'sofa',
      name: 'Velvet Sofa',
      price: 599.99,
      image: '/images/sofa.jpg',
      color: '#4B0082',
      shade: 30,
      scale: 1,
    },
    {
      id: 'bookshelf1',
      type: 'bookshelf',
      name: 'Tall Bookshelf',
      price: 199.99,
      image: '/images/bookshelf.jpg',
      color: '#8B4513',
      shade: 50,
      scale: 1,
    },
    {
      id: 'tvstand1',
      type: 'tvstand',
      name: 'Sleek TV Stand',
      price: 249.99,
      image: '/images/tvstand.jpg',
      color: '#2F4F4F',
      shade: 50,
      scale: 1,
    },
    {
      id: 'bed1',
      type: 'bed',
      name: 'Cozy Double Bed',
      price: 499.99,
      image: '/images/bed.jpg',
      color: '#4682B4',
      shade: 30,
      scale: 1,
    },
    {
      id: 'lamp1',
      type: 'lamp',
      name: 'Golden Floor Lamp',
      price: 149.99,
      image: '/images/lamp.jpg',
      color: '#FFD700',
      shade: 70,
      scale: 1,
    },
  ];

  const [room, setRoom] = useState(predefinedRooms[0]);
  const [furniture, setFurniture] = useState([]);
  const [viewMode, setViewMode] = useState('3D');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    room: true,
    catalog: true,
    furnitureSettings: true,
    viewMode: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const catalogRef = useRef(null);
  const furnitureSettingsRef = useRef(null);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const validateDimension = (value) => {
    const num = parseFloat(value);
    return isNaN(num) || num <= 0 ? 1 : num;
  };

  const handleRoomChange = (roomId) => {
    const selectedRoom = predefinedRooms.find((r) => r.id === roomId);
    if (selectedRoom) {
      setRoom(selectedRoom);
      setFurniture([]);
    }
  };

  const handleWallTextureChange = (textureFile) => {
    setRoom({ ...room, wallTexture: textureFile });
  };

  const addFurniture = (product) => {
    const furnitureCount = furniture.length;
    const x = (furnitureCount % 3) * 2 - 2;
    const z = Math.floor(furnitureCount / 3) * 2 - 2;
    const newItem = {
      id: Date.now(),
      type: product.type,
      name: product.name,
      price: product.price,
      x,
      z,
      color: product.color,
      shade: product.shade,
      scale: product.scale,
    };
    setFurniture([...furniture, newItem]);
    addToCart(product);
    if (catalogRef.current) {
      catalogRef.current.scrollTo({ top: catalogRef.current.scrollHeight, behavior: 'smooth' });
    }
    if (furnitureSettingsRef.current) {
      furnitureSettingsRef.current.scrollTo({ top: furnitureSettingsRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(
        cart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateFurniture = (index, updates) => {
    const updatedFurniture = [...furniture];
    updatedFurniture[index] = { ...updatedFurniture[index], ...updates };
    setFurniture(updatedFurniture);
  };

  const saveDesign = () => {
    const design = {
      id: Date.now(),
      room,
      furniture,
      name: `Design ${designs.length + 1} (${room.name})`,
    };
    setDesigns([...designs, design]);
    resetDesign();
  };

  const editDesign = (design) => {
    setRoom(design.room);
    setFurniture(design.furniture);
  };

  const deleteDesign = (id) => {
    setDesigns(designs.filter((d) => d.id !== id));
    setShowDeleteConfirm(null);
  };

  const resetDesign = () => {
    setFurniture([]);
    setRoom(predefinedRooms[0]);
    setViewMode('3D');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const totalCartPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (showCheckout) {
    return <Checkout cart={cart} setCart={setCart} setShowCheckout={setShowCheckout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
      <nav className="bg-gradient-to-r from-yellow-900 to-yellow-800 text-white p-4 shadow-lg sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold tracking-tight">Furniture Design Studio</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCart(!showCart)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-900 hover:bg-yellow-800 rounded-lg transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-900 hover:bg-yellow-800 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-6 space-y-6">
            <div>
              <button
                onClick={() => toggleSection('room')}
                className="w-full flex justify-between items-center text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Room Settings
                {expandedSections.room ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.room && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                  <select
                    value={room.id}
                    onChange={(e) => handleRoomChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    {predefinedRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={room.wallTexture}
                    onChange={(e) => handleWallTextureChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  >
                    {wallTextures.map((texture) => (
                      <option key={texture.id} value={texture.file}>
                        {texture.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Width (m)"
                    value={room.width}
                    onChange={(e) => setRoom({ ...room, width: validateDimension(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Height (m)"
                    value={room.height}
                    onChange={(e) => setRoom({ ...room, height: validateDimension(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Depth (m)"
                    value={room.depth}
                    onChange={(e) => setRoom({ ...room, depth: validateDimension(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <input
                    type="color"
                    value={room.color}
                    onChange={(e) => setRoom({ ...room, color: e.target.value })}
                    className="w-full h-12 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection('catalog')}
                className="w-full flex justify-between items-center text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Product Catalog
                {expandedSections.catalog ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.catalog && (
                <div className="mt-4 space-y-4 animate-fadeIn max-h-[500px] overflow-y-auto" ref={catalogRef}>
                  {productCatalog.map((product) => (
                    <div key={product.id} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                      />
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-gray-600">${product.price.toFixed(2)}</p>
                      <button
                        onClick={() => addFurniture(product)}
                        className="w-full p-2 mt-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        Add to Room & Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection('furnitureSettings')}
                className="w-full flex justify-between items-center text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                Furniture Settings
                {expandedSections.furnitureSettings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.furnitureSettings && (
                <div className="mt-4 space-y-4 animate-fadeIn max-h-[500px] overflow-y-auto" ref={furnitureSettingsRef}>
                  {furniture.length === 0 ? (
                    <p className="text-gray-500 text-center">No furniture added.</p>
                  ) : (
                    furniture.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <p className="capitalize font-medium text-gray-900">
                          {item.name || item.type} #{index + 1}
                        </p>
                        <input
                          type="number"
                          placeholder="X Position (m)"
                          value={item.x || 0}
                          onChange={(e) =>
                            updateFurniture(index, { x: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        <input
                          type="number"
                          placeholder="Z Position (m)"
                          value={item.z || 0}
                          onChange={(e) =>
                            updateFurniture(index, { z: parseFloat(e.target.value) || 0 })
                          }
                          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        <input
                          type="number"
                          placeholder="Scale"
                          value={item.scale || 1}
                          min="0.1"
                          step="0.1"
                          onChange={(e) =>
                            updateFurniture(index, { scale: parseFloat(e.target.value) || 1 })
                          }
                          className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        />
                        <input
                          type="color"
                          value={item.color}
                          onChange={(e) => updateFurniture(index, { color: e.target.value })}
                          className="w-full h-12 mt-2 rounded-lg cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={item.shade || 50}
                          onChange={(e) =>
                            updateFurniture(index, { shade: parseFloat(e.target.value) })
                          }
                          className="w-full mt-2 accent-indigo-500"
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => toggleSection('viewMode')}
                className="w-full flex justify-between items-center text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                View Mode
                {expandedSections.viewMode ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.viewMode && (
                <div className="mt-4 space-y-3 animate-fadeIn">
                  <button
                    onClick={() => setViewMode('2D')}
                    className={`w-full p-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      viewMode === '2D'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    2D View
                  </button>
                  <button
                    onClick={() => setViewMode('3D')}
                    className={`w-full p-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      viewMode === '3D'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    3D View
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveDesign}
                className="flex-1 p-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
              <button
                onClick={resetDesign}
                className="flex-1 p-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Design Canvas</h2>
            <div className="w-full h-[600px] rounded-lg overflow-hidden">
              <DesignCanvas
                room={room}
                furniture={furniture}
                viewMode={viewMode}
                onUpdateFurniture={updateFurniture}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Designs</h2>
          {designs.length === 0 ? (
            <p className="text-gray-500 text-center">No designs saved yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="p-4 bg-gray-50 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <p className="text-gray-500">{design.room.name} Preview</p>
                  </div>
                  <p className="font-medium text-gray-900 truncate">{design.name}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => editDesign(design)}
                      className="flex-1 p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-5 h-5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(design.id)}
                      className="flex-1 p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showCart && (
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl p-6 overflow-auto z-30 animate-slideIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-all duration-300"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300 transition-all duration-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-rose-100 rounded-full transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5 text-rose-500" />
                    </button>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <p className="text-lg font-semibold text-gray-900">
                    Total: ${totalCartPrice.toFixed(2)}
                  </p>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full p-3 mt-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center gap-2"
                    disabled={cart.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this design?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 p-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteDesign(showDeleteConfirm)}
                  className="flex-1 p-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default DesignDashboard;