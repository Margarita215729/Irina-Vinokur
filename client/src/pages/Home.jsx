import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Palette, Award, Users, Eye } from 'lucide-react';
import { artworksAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedArtworks();
  }, []);

  const fetchFeaturedArtworks = async () => {
    try {
      const response = await artworksAPI.getAll({ for_sale: true });
      setFeaturedArtworks(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching featured artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePlaceholderImage = (width = 400, height = 300) => {
    return `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`;
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content fade-in">
            <div className="hero-text">
              <h1 className="hero-title">
                Capturing Nature's Poetry
                <span className="hero-accent">Through Impressionist Art</span>
              </h1>
              <p className="hero-description">
                Welcome to the artistic world of Irina Vinokur, where each brushstroke 
                tells a story of light, color, and emotion. Inspired by the masters 
                like Claude Monet, discover original artworks that bring nature's 
                beauty into your space.
              </p>
              <div className="hero-actions">
                <Link to="/portfolio" className="btn btn-primary">
                  Explore Portfolio
                  <ChevronRight className="icon" />
                </Link>
                <Link to="/portfolio?for_sale=true" className="btn btn-outline">
                  Shop Artworks
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-artwork float">
                <img 
                  src={generatePlaceholderImage(500, 400)} 
                  alt="Featured Artwork" 
                  className="hero-artwork-img"
                />
                <div className="hero-artwork-overlay">
                  <span className="hero-artwork-label">Latest Creation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item card slide-in">
              <div className="stat-icon">
                <Palette />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">50+</h3>
                <p className="stat-label">Original Artworks</p>
              </div>
            </div>
            <div className="stat-item card slide-in">
              <div className="stat-icon">
                <Award />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">15+</h3>
                <p className="stat-label">Years Experience</p>
              </div>
            </div>
            <div className="stat-item card slide-in">
              <div className="stat-icon">
                <Users />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">200+</h3>
                <p className="stat-label">Happy Collectors</p>
              </div>
            </div>
            <div className="stat-item card slide-in">
              <div className="stat-icon">
                <Eye />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">25+</h3>
                <p className="stat-label">Exhibitions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="featured section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Artworks</h2>
            <p className="section-description">
              Discover some of the most captivating pieces currently available
            </p>
          </div>

          {loading ? (
            <div className="featured-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="artwork-card loading-shimmer"></div>
              ))}
            </div>
          ) : (
            <div className="featured-grid">
              {featuredArtworks.map((artwork) => (
                <div key={artwork.id} className="artwork-card card fade-in">
                  <div className="artwork-image">
                    <img
                      src={artwork.image_url ? `http://localhost:5000${artwork.image_url}` : generatePlaceholderImage()}
                      alt={artwork.title}
                      className="artwork-img"
                    />
                    <div className="artwork-overlay">
                      <span className="artwork-price">${artwork.price}</span>
                    </div>
                  </div>
                  <div className="artwork-info">
                    <h3 className="artwork-title">{artwork.title}</h3>
                    <p className="artwork-description">{artwork.description}</p>
                    <div className="artwork-meta">
                      <span className="artwork-medium">{artwork.medium}</span>
                      <span className="artwork-year">{artwork.year_created}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="featured-actions">
            <Link to="/portfolio" className="btn btn-primary">
              View All Artworks
              <ChevronRight className="icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="about-title">About the Artist</h2>
              <p className="about-description">
                Irina Vinokur is a contemporary impressionist painter whose work 
                captures the ephemeral beauty of natural landscapes. Drawing 
                inspiration from Claude Monet's revolutionary approach to light 
                and color, Irina creates paintings that evoke emotion and 
                transport viewers to serene natural settings.
              </p>
              <p className="about-description">
                With over 15 years of artistic practice, her work has been 
                featured in galleries across the country and is held in private 
                collections worldwide. Each piece is a meditation on the 
                interplay between light, shadow, and the ever-changing moods 
                of nature.
              </p>
              <Link to="/portfolio" className="btn btn-secondary">
                Learn More About My Work
              </Link>
            </div>
            <div className="about-image">
              <img 
                src={generatePlaceholderImage(400, 500)} 
                alt="Artist at work"
                className="about-img"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;