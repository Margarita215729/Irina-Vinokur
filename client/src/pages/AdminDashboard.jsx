import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Palette, 
  ShoppingCart, 
  Plus, 
  Edit, 
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { adminAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/artworks" element={<ArtworksManager />} />
          <Route path="/orders" element={<OrdersManager />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    const currentPath = location.pathname.replace('/admin', '');
    return currentPath === path || (path === '/' && currentPath === '');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <Link 
          to="/admin" 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          <BarChart3 className="nav-icon" />
          Dashboard
        </Link>
        <Link 
          to="/admin/artworks" 
          className={`nav-item ${isActive('/artworks') ? 'active' : ''}`}
        >
          <Palette className="nav-icon" />
          Artworks
        </Link>
        <Link 
          to="/admin/orders" 
          className={`nav-item ${isActive('/orders') ? 'active' : ''}`}
        >
          <ShoppingCart className="nav-icon" />
          Orders
        </Link>
      </nav>
    </div>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalSales: 0,
    totalRevenue: 0,
    availableArtworks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-home">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card loading-shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <h1>Dashboard Overview</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Palette />
          </div>
          <div className="stat-content">
            <h3>{stats.totalArtworks}</h3>
            <p>Total Artworks</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <ShoppingCart />
          </div>
          <div className="stat-content">
            <h3>{stats.totalSales}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 />
          </div>
          <div className="stat-content">
            <h3>${stats.totalRevenue.toFixed(2)}</h3>
            <p>Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <ImageIcon />
          </div>
          <div className="stat-content">
            <h3>{stats.availableArtworks}</h3>
            <p>Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArtworksManager = () => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);

  useEffect(() => {
    fetchArtworks();
    fetchCategories();
  }, []);

  const fetchArtworks = async () => {
    try {
      const response = await adminAPI.getArtworks();
      setArtworks(response.data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await adminAPI.deleteArtwork(id);
        fetchArtworks();
      } catch (error) {
        console.error('Error deleting artwork:', error);
      }
    }
  };

  const generatePlaceholderImage = (width = 150, height = 150) => {
    return `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`;
  };

  return (
    <div className="artworks-manager">
      <div className="page-header">
        <h1>Artworks Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingArtwork(null);
            setShowForm(true);
          }}
        >
          <Plus className="icon" />
          Add Artwork
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading artworks...</div>
      ) : (
        <div className="artworks-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map((artwork) => (
                <tr key={artwork.id}>
                  <td>
                    <img
                      src={artwork.image_url ? `http://localhost:5000${artwork.image_url}` : generatePlaceholderImage()}
                      alt={artwork.title}
                      className="artwork-thumbnail"
                    />
                  </td>
                  <td>{artwork.title}</td>
                  <td>{artwork.category_name || 'Uncategorized'}</td>
                  <td>${artwork.price}</td>
                  <td>
                    <span className={`status ${artwork.is_sold ? 'sold' : artwork.is_for_sale ? 'for-sale' : 'not-for-sale'}`}>
                      {artwork.is_sold ? 'Sold' : artwork.is_for_sale ? 'For Sale' : 'Not for Sale'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-icon edit"
                        onClick={() => {
                          setEditingArtwork(artwork);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="icon" />
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => handleDelete(artwork.id)}
                      >
                        <Trash2 className="icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ArtworkForm
          artwork={editingArtwork}
          categories={categories}
          onClose={() => {
            setShowForm(false);
            setEditingArtwork(null);
          }}
          onSuccess={() => {
            fetchArtworks();
            setShowForm(false);
            setEditingArtwork(null);
          }}
        />
      )}
    </div>
  );
};

const ArtworkForm = ({ artwork, categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: artwork?.title || '',
    description: artwork?.description || '',
    price: artwork?.price || '',
    category_id: artwork?.category_id || '',
    dimensions: artwork?.dimensions || '',
    medium: artwork?.medium || '',
    year_created: artwork?.year_created || '',
    is_for_sale: artwork?.is_for_sale || false
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (artwork) {
        await adminAPI.updateArtwork(artwork.id, data);
      } else {
        await adminAPI.createArtwork(data);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving artwork:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{artwork ? 'Edit Artwork' : 'Add New Artwork'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit} className="artwork-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="form-input form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                className="form-input"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_for_sale}
                onChange={(e) => setFormData({...formData, is_for_sale: e.target.checked})}
              />
              Available for sale
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orders-manager">
      <h1>Orders Management</h1>
      
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Artworks</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.user_name}</td>
                  <td>{order.artwork_titles}</td>
                  <td>${order.total_amount}</td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;