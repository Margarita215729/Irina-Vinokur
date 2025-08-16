import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ShoppingCart, Eye, Palette } from 'lucide-react';
import { artworksAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Portfolio.css';

const Portfolio = () => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const selectedCategory = searchParams.get('category');
  const forSale = searchParams.get('for_sale') === 'true';

  useEffect(() => {
    fetchArtworks();
    fetchCategories();
  }, [selectedCategory, forSale]);

  const fetchArtworks = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (forSale) params.for_sale = 'true';
      
      const response = await artworksAPI.getAll(params);
      setArtworks(response.data);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await artworksAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryFilter = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleForSaleFilter = (isForSale) => {
    const newParams = new URLSearchParams(searchParams);
    if (isForSale) {
      newParams.set('for_sale', 'true');
    } else {
      newParams.delete('for_sale');
    }
    setSearchParams(newParams);
  };

  const handleAddToCart = (artwork) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    addToCart(artwork);
  };

  const generatePlaceholderImage = (width = 400, height = 300) => {
    return `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`;
  };

  return (
    <div className="portfolio">
      <div className="container">
        <div className="portfolio-header">
          <h1 className="portfolio-title">Art Portfolio</h1>
          <p className="portfolio-description">
            Explore a collection of impressionist paintings that capture the beauty of nature
          </p>
        </div>

        {/* Filters */}
        <div className="portfolio-filters">
          <div className="filter-group">
            <h3 className="filter-title">
              <Filter className="icon" />
              Categories
            </h3>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(null)}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => handleCategoryFilter(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Availability</h3>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${!forSale ? 'active' : ''}`}
                onClick={() => handleForSaleFilter(false)}
              >
                All Works
              </button>
              <button
                className={`filter-btn ${forSale ? 'active' : ''}`}
                onClick={() => handleForSaleFilter(true)}
              >
                For Sale
              </button>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        {loading ? (
          <div className="artworks-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="artwork-card loading-shimmer"></div>
            ))}
          </div>
        ) : (
          <div className="artworks-grid">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="artwork-card card fade-in">
                <div className="artwork-image">
                  <img
                    src={artwork.image_url ? `http://localhost:5000${artwork.image_url}` : generatePlaceholderImage()}
                    alt={artwork.title}
                    className="artwork-img"
                  />
                  <div className="artwork-overlay">
                    {artwork.is_for_sale && !artwork.is_sold && (
                      <span className="artwork-price">${artwork.price}</span>
                    )}
                    {artwork.is_sold && (
                      <span className="artwork-sold">Sold</span>
                    )}
                  </div>
                  <div className="artwork-actions">
                    <button className="action-btn view-btn">
                      <Eye className="icon" />
                    </button>
                    {artwork.is_for_sale && !artwork.is_sold && isAuthenticated && (
                      <button 
                        className="action-btn cart-btn"
                        onClick={() => handleAddToCart(artwork)}
                      >
                        <ShoppingCart className="icon" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="artwork-info">
                  <h3 className="artwork-title">{artwork.title}</h3>
                  <p className="artwork-description">{artwork.description}</p>
                  <div className="artwork-meta">
                    <span className="artwork-category">{artwork.category_name}</span>
                    <span className="artwork-medium">{artwork.medium}</span>
                    <span className="artwork-year">{artwork.year_created}</span>
                  </div>
                  {artwork.dimensions && (
                    <p className="artwork-dimensions">{artwork.dimensions}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {artworks.length === 0 && !loading && (
          <div className="empty-state">
            <Palette className="empty-icon" />
            <h3>No artworks found</h3>
            <p>Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;