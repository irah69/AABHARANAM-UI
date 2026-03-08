import Link from "next/link";
import "../styles/FeaturedProducts.css";

export default function FeaturedProducts({ products }) {
  return (
    <section className="featured-section">
      {/* Section Header */}
      <div className="featured-header">
        <h2>Featured Collection</h2>
        {/* <p>Curated editorial picks for the season</p> */}
      </div>

      {/* Editorial Grid */}
      <div className="featured-grid">
        <div className="featured-item large">
          <Link href="/products">
            <img
              src="/saree.png"
              alt="Product"
              className="cursor-pointer"
            />
          </Link>
          <span>THE ART OF STILLNESS</span>
        </div>

        <div className="featured-item large">
          <img src="/saree.png" alt="Product" />
          <span>MODERN FORM</span>
        </div>

        <div className="featured-item">
          <img src="/saree.png" alt="Product" />
          <span>ESSENTIAL SILHOUETTE</span>
        </div>

        <div className="featured-item">
          <img src="/saree.png" alt="Product" />
          <span>TIMELESS WEAR</span>
        </div>

        <div className="featured-item">
          <img src="/saree.png" alt="Product" />
          <span>MINIMAL STATEMENT</span>
        </div>

        <div className="featured-item">
          <img src="/saree.png" alt="Product" />
          <span>ELEGANT GRACE</span>
        </div>
      </div>

      {/* CTA */}
      {/* <div className="featured-cta">
        <button>View Full Collection</button>
      </div> */}
    </section>
  );
}