import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Sweet } from '../../types';
import { useCart } from '../../context/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface SweetCardProps {
  sweet: Sweet;
}

const SweetCard = ({ sweet }: SweetCardProps) => {
  const { addItem, isInCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      sweetId: sweet.id,
      name: sweet.name,
      price: sweet.price,
      image: `https://source.unsplash.com/random/300x300/?${sweet.name}`,
      maxQuantity: sweet.quantity,
    });
  };

  return (
    <Card
      component={RouterLink}
      to={`/sweets/${sweet.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={`https://source.unsplash.com/random/300x200/?${sweet.name}`}
        alt={sweet.name}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {sweet.name}
          </Typography>
          <Chip
            label={sweet.category}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          {sweet.description || 'No description available.'}
        </Typography>
        
        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography variant="h6" color="primary">
              ${sweet.price.toFixed(2)}
            </Typography>
            <Typography
              variant="body2"
              color={sweet.quantity > 0 ? 'success.main' : 'error.main'}
            >
              {sweet.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </Typography>
          </Box>
          
          <Button
            fullWidth
            variant={isInCart(sweet.id) ? 'outlined' : 'contained'}
            color="primary"
            size="small"
            startIcon={<ShoppingCartIcon />}
            disabled={sweet.quantity === 0}
            onClick={handleAddToCart}
            sx={{ mt: 1 }}
          >
            {isInCart(sweet.id) ? 'In Cart' : 'Add to Cart'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SweetCard;