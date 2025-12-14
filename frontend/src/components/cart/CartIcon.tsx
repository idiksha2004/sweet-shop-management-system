import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartIcon = () => {
  const { itemCount } = useCart();

  return (
    <IconButton
      component={RouterLink}
      to="/cart"
      color="inherit"
      aria-label={`${itemCount} items in cart`}
    >
      <Badge badgeContent={itemCount} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartIcon;