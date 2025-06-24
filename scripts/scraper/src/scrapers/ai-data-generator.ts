// @ts-nocheck
import { WineData } from '../types/wine';

export class AIDataGenerator {
  
  // Wine regions and their typical varietals
  private wineRegions = {
    'Bordeaux, France': ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc', 'Petit Verdot'],
    'Burgundy, France': ['Pinot Noir', 'Chardonnay'],
    'Champagne, France': ['Champagne', 'Blanc de Blancs', 'Blanc de Noirs'],
    'Tuscany, Italy': ['Sangiovese', 'Chianti', 'Brunello di Montalcino'],
    'Piedmont, Italy': ['Nebbiolo', 'Barolo', 'Barbaresco'],
    'Napa Valley, California': ['Cabernet Sauvignon', 'Chardonnay', 'Merlot'],
    'Sonoma County, California': ['Pinot Noir', 'Zinfandel', 'Chardonnay'],
    'Willamette Valley, Oregon': ['Pinot Noir', 'Pinot Gris'],
    'Rioja, Spain': ['Tempranillo', 'Garnacha'],
    'Douro, Portugal': ['Port', 'Touriga Nacional'],
    'Barossa Valley, Australia': ['Shiraz', 'Grenache'],
    'Marlborough, New Zealand': ['Sauvignon Blanc', 'Pinot Noir'],
    'Mosel, Germany': ['Riesling', 'Gewürztraminer']
  };

  private spiritsTypes = {
    'Scotch Whisky': {
      regions: ['Speyside', 'Highlands', 'Islay', 'Lowlands', 'Campbeltown'],
      ages: [12, 15, 18, 21, 25, 30]
    },
    'Irish Whiskey': {
      regions: ['Dublin', 'Cork', 'Antrim'],
      ages: [12, 15, 18, 21]
    },
    'American Whiskey': {
      regions: ['Kentucky', 'Tennessee', 'Indiana'],
      types: ['Bourbon', 'Rye', 'Single Malt']
    },
    'Cognac': {
      regions: ['Grande Champagne', 'Petite Champagne', 'Borderies'],
      grades: ['VS', 'VSOP', 'XO', 'XXO']
    },
    'Rum': {
      regions: ['Jamaica', 'Barbados', 'Cuba', 'Guatemala'],
      ages: [8, 12, 15, 18, 21]
    },
    'Tequila': {
      regions: ['Jalisco', 'Nayarit', 'Guanajuato'],
      types: ['Blanco', 'Reposado', 'Añejo', 'Extra Añejo']
    }
  };

  private wineProducers = {
    'Bordeaux, France': ['Château Margaux', 'Château Lafite Rothschild', 'Château Latour', 'Château Haut-Brion', 'Château Mouton Rothschild', 'Château Pichon Baron', 'Château Lynch-Bages'],
    'Burgundy, France': ['Domaine de la Romanée-Conti', 'Domaine Leroy', 'Domaine Armand Rousseau', 'Domaine Georges Roumier', 'Domaine Coche-Dury'],
    'Champagne, France': ['Dom Pérignon', 'Krug', 'Louis Roederer', 'Bollinger', 'Pol Roger'],
    'Tuscany, Italy': ['Antinori', 'Ornellaia', 'Sassicaia', 'Solaia', 'Tignanello'],
    'Napa Valley, California': ['Screaming Eagle', 'Harlan Estate', 'Opus One', 'Caymus', 'Silver Oak'],
    'Sonoma County, California': ['Williams Selyem', 'Rochioli', 'Kosta Browne']
  };

  private spiritsProducers = {
    'Scotch Whisky': ['Macallan', 'Glenfiddich', 'Balvenie', 'Ardbeg', 'Lagavulin', 'Glenlivet', 'Highland Park'],
    'Irish Whiskey': ['Redbreast', 'Green Spot', 'Jameson', 'Tullamore Dew'],
    'American Whiskey': ['Pappy Van Winkle', 'Buffalo Trace', 'Maker\'s Mark', 'Woodford Reserve'],
    'Cognac': ['Hennessy', 'Rémy Martin', 'Martell', 'Courvoisier'],
    'Rum': ['Mount Gay', 'Appleton Estate', 'Zacapa', 'Diplomatico'],
    'Tequila': ['Herradura', 'Patrón', 'Don Julio', 'Casa Noble']
  };

  generateWines(count: number): WineData[] {
    const wines: WineData[] = [];
    
    for (let i = 0; i < count; i++) {
      const region = this.getRandomKey(this.wineRegions) as string;
      const varietals = this.wineRegions[region as keyof typeof this.wineRegions];
      const varietal = this.getRandomItem(varietals) as string;
      const producers = this.wineProducers[region as keyof typeof this.wineProducers] || ['Estate Winery', 'Domaine Vineyard', 'Château Estate'];
      const producer = this.getRandomItem(producers) as string;
      const vintage = this.getRandomVintage();
      
      const wine: WineData = {
        name: `${producer} ${varietal} ${vintage}`,
        description: this.generateWineDescription(varietal, region, vintage),
        type: 'wine',
        varietal,
        region,
        vintage,
        producer,
        alcohol_content: this.getRandomFloat(11.5, 15.5),
        volume_ml: 750,
        base_price: this.generateWinePrice(region, producer, vintage),
        current_price: 0, // Will be set to base_price
        average_rating: this.getRandomFloat(3.5, 5.0),
        total_reviews: this.getRandomInt(10, 500),
        wine_spectator_score: this.getRandomInt(85, 100),
        robert_parker_score: this.getRandomInt(85, 100),
        primary_image_url: this.generateImageUrl('wine', producer, varietal),
        tasting_notes: this.generateTastingNotes('wine', varietal),
        food_pairings: this.generateFoodPairings('wine', varietal),
        serving_temperature: this.getWineServingTemp(varietal),
        aging_potential: this.getAgingPotential(varietal, vintage),
        source_url: 'ai-generated',
        scraped_at: new Date()
      };
      
      wine.current_price = wine.base_price;
      wines.push(wine);
    }
    
    return wines;
  }

  generateSpirits(count: number): WineData[] {
    const spirits: WineData[] = [];
    
    for (let i = 0; i < count; i++) {
      const spiritType = this.getRandomKey(this.spiritsTypes) as string;
      const spiritData = this.spiritsTypes[spiritType as keyof typeof this.spiritsTypes];
      const producers = this.spiritsProducers[spiritType as keyof typeof this.spiritsProducers] || ['Artisan Distillery', 'Heritage Spirits', 'Premium Distillers'];
      const producer = this.getRandomItem(producers) as string;
      
      let name = producer;
      let varietal = spiritType;
      let region = '';
      
      if (spiritData.regions) {
        region = this.getRandomItem(spiritData.regions) as string;
      }
      
      if (spiritData.ages) {
        const age = this.getRandomItem(spiritData.ages);
        name += ` ${age} Year`;
        varietal += ` ${age} Year`;
      } else if ('types' in spiritData && spiritData.types) {
        const type = this.getRandomItem(spiritData.types) as string;
        name += ` ${type}`;
        varietal = type;
      } else if ('grades' in spiritData && spiritData.grades) {
        const grade = this.getRandomItem(spiritData.grades) as string;
        name += ` ${grade}`;
        varietal = `${spiritType} ${grade}`;
      }
      
      const spirit: WineData = {
        name,
        description: this.generateSpiritsDescription(spiritType, region),
        type: 'spirits',
        varietal,
        region: region || 'Various',
        producer,
        alcohol_content: this.getRandomFloat(35, 50),
        volume_ml: this.getRandomItem([700, 750, 1000]),
        base_price: this.generateSpiritsPrice(spiritType, name),
        current_price: 0, // Will be set to base_price
        average_rating: this.getRandomFloat(3.8, 5.0),
        total_reviews: this.getRandomInt(20, 300),
        primary_image_url: this.generateImageUrl('spirits', producer, spiritType),
        tasting_notes: this.generateTastingNotes('spirits', spiritType),
        serving_temperature: 'Room temperature',
        aging_potential: 'Ready to drink',
        source_url: 'ai-generated',
        scraped_at: new Date()
      };
      
      spirit.current_price = spirit.base_price;
      spirits.push(spirit);
    }
    
    return spirits;
  }

  // Helper methods
  private getRandomKey<T>(obj: Record<string, T>): keyof typeof obj {
    const keys = Object.keys(obj) as Array<keyof typeof obj>;
    return keys[Math.floor(Math.random() * keys.length)];
  }

  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomFloat(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  }

  private getRandomVintage(): number {
    const currentYear = new Date().getFullYear();
    return currentYear - this.getRandomInt(1, 25);
  }

  private generateWinePrice(region: string, producer: string, vintage: number): number {
    const currentYear = new Date().getFullYear();
    const age = currentYear - vintage;
    
    let basePrice = 50;
    
    // Premium regions
    if (region.includes('Bordeaux') || region.includes('Burgundy')) {
      basePrice = 200;
    }
    if (region.includes('Napa Valley')) {
      basePrice = 150;
    }
    
    // Premium producers
    if (producer.includes('Château Margaux') || producer.includes('DRC')) {
      basePrice *= 5;
    }
    if (producer.includes('Screaming Eagle') || producer.includes('Harlan')) {
      basePrice *= 3;
    }
    
    // Age factor
    basePrice += age * 5;
    
    // Random variation
    basePrice *= (0.8 + Math.random() * 0.4);
    
    return Math.round(basePrice);
  }

  private generateSpiritsPrice(type: string, name: string): number {
    let basePrice = 60;
    
    if (type.includes('Whisky') || type.includes('Whiskey')) {
      basePrice = 100;
    }
    if (type.includes('Cognac')) {
      basePrice = 150;
    }
    
    // Age premium
    const ageMatch = name.match(/(\d+)\s*Year/);
    if (ageMatch) {
      const age = parseInt(ageMatch[1]);
      basePrice += age * 15;
    }
    
    // Premium brands
    if (name.includes('Macallan') || name.includes('Pappy')) {
      basePrice *= 2;
    }
    
    // Random variation
    basePrice *= (0.8 + Math.random() * 0.4);
    
    return Math.round(basePrice);
  }

  private generateImageUrl(type: string, producer: string, varietal: string): string {
    const slug = `${producer.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${varietal.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    return `/images/${type}s/${slug}.jpg`;
  }

  private generateWineDescription(varietal: string, region: string, vintage: number): string {
    const descriptions = [
      `Exceptional ${varietal} from ${region}, vintage ${vintage}. A wine of remarkable character and finesse.`,
      `Classic ${region} expression of ${varietal}. The ${vintage} vintage showcases the terroir beautifully.`,
      `Premium ${varietal} from the prestigious ${region} region. ${vintage} was an outstanding vintage.`,
      `Elegant ${varietal} representing the finest traditions of ${region}. The ${vintage} harvest was exceptional.`
    ];
    return this.getRandomItem(descriptions);
  }

  private generateSpiritsDescription(type: string, region: string): string {
    const descriptions = [
      `Premium ${type} crafted with traditional methods. ${region ? `From the renowned ${region} region.` : 'Artfully distilled.'}`,
      `Exceptional ${type} showcasing master distillation. ${region ? `${region} heritage at its finest.` : 'Meticulously crafted.'}`,
      `Distinguished ${type} with complex character. ${region ? `Representing ${region} excellence.` : 'Premium quality spirit.'}`,
      `Fine ${type} aged to perfection. ${region ? `Classic ${region} style.` : 'Expertly balanced.'}`,
    ];
    return this.getRandomItem(descriptions);
  }

  private generateTastingNotes(type: string, varietal: string): string {
    const wineNotes = {
      'Cabernet Sauvignon': 'Rich blackcurrant, cedar, and tobacco with firm tannins and a long finish.',
      'Pinot Noir': 'Elegant red cherry, earth, and spice with silky texture and bright acidity.',
      'Chardonnay': 'Crisp green apple, citrus, and vanilla with creamy texture and mineral finish.',
      'Champagne': 'Fine bubbles with notes of brioche, citrus, and subtle yeast complexity.'
    };
    
    const spiritNotes = {
      'Scotch Whisky': 'Complex malt with honey, vanilla, and subtle smoke. Long, warming finish.',
      'Irish Whiskey': 'Smooth and approachable with notes of honey, spice, and gentle fruit.',
      'American Whiskey': 'Rich caramel, vanilla, and oak with spicy rye and sweet corn notes.',
      'Cognac': 'Luxurious blend of dried fruits, spice, and oak with elegant complexity.'
    };
    
    if (type === 'wine') {
      return wineNotes[varietal] || 'Complex and well-balanced with excellent structure and length.';
    } else {
      for (const spirit in spiritNotes) {
        if (varietal.includes(spirit)) {
          return spiritNotes[spirit];
        }
      }
      return 'Smooth and complex with rich flavors and a satisfying finish.';
    }
  }

  private generateFoodPairings(type: string, varietal: string): string[] {
    const winePairings = {
      'Cabernet Sauvignon': ['Grilled Red Meat', 'Aged Cheese', 'Dark Chocolate'],
      'Pinot Noir': ['Duck', 'Salmon', 'Mushroom Dishes'],
      'Chardonnay': ['Lobster', 'Roasted Chicken', 'Creamy Pasta'],
      'Champagne': ['Oysters', 'Caviar', 'Light Appetizers']
    };
    
    return winePairings[varietal] || ['Fine Dining', 'Gourmet Cheese', 'Special Occasions'];
  }

  private getWineServingTemp(varietal: string): string {
    if (varietal.includes('Champagne') || varietal === 'Sauvignon Blanc') {
      return '6-8°C';
    }
    if (varietal === 'Chardonnay' || varietal === 'Pinot Grigio') {
      return '8-12°C';
    }
    return '16-18°C';
  }

  private getAgingPotential(varietal: string, vintage: number): string {
    const currentYear = new Date().getFullYear();
    const age = currentYear - vintage;
    
    if (varietal.includes('Cabernet') || varietal.includes('Bordeaux')) {
      return age > 15 ? 'Drinking well now, can age further' : '10-20 years';
    }
    if (varietal === 'Pinot Noir') {
      return age > 10 ? 'Drinking well now' : '5-15 years';
    }
    if (varietal === 'Chardonnay') {
      return age > 8 ? 'Drinking well now' : '3-10 years';
    }
    
    return 'Ready to drink';
  }
}

// Export function to generate mixed data
export async function generateLargeDataset(wineCount: number = 500, spiritsCount: number = 300): Promise<WineData[]> {
  const generator = new AIDataGenerator();
  
  console.log(`🤖 Generating ${wineCount} wines and ${spiritsCount} spirits...`);
  
  const wines = generator.generateWines(wineCount);
  const spirits = generator.generateSpirits(spiritsCount);
  
  const allProducts = [...wines, ...spirits];
  
  console.log(`✅ Generated ${allProducts.length} total products`);
  
  return allProducts;
} 