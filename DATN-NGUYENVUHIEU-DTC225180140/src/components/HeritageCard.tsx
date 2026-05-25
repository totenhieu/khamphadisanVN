import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";

const HeritageCard = ({ heritage }: { heritage: any }) => {
  const firstImage = heritage.image?.split(',')[0] || 'https://placehold.co/400x500?text=No+Image';

  return (
    <Link
      to={`/di-san/${heritage.slug}`}
      className="group relative block rounded-3xl overflow-hidden bg-card border border-border/60 shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-smooth"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={firstImage}
          alt={heritage.name}
          loading="lazy"
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />

        {/* top tags */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full glass text-foreground text-xs font-medium">
            {heritage.category}
          </span>
          <span className="w-9 h-9 rounded-full glass flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-smooth">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        {/* bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-background">
          <div className="flex items-center gap-1.5 text-xs text-background/80 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            {heritage.province}
          </div>
          <h3 className="font-display text-xl font-semibold leading-tight mb-1.5 line-clamp-2">
            {heritage.name}
          </h3>
          <p className="text-xs text-background/75 line-clamp-2">
            {heritage.shortDescription}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default HeritageCard;
