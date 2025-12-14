// ... existing imports ...
import { useCart } from '../../context/CartContext';

const SweetDetailPage = () => {
  // ... existing state and hooks ...
  const { addItem, isInCart } = useCart();

  // ... existing code ...

  const handleAddToCart = () => {
    if (!sweet) return;
    
    addItem({
      sweetId: sweet.id,
      name: sweet.name,
      price: sweet.price,
      image: `https://source.unsplash.com/random/300x300/?${sweet.name}`,
      maxQuantity: sweet.quantity,
    });

    setSnackbar({
      open: true,
      message: `${sweet.name} added to cart!`,
      severity: 'success',
    });
  };

  // ... in the return statement, update the Add to Cart button:

  <Button
    variant="contained"
    color="primary"
    size="large"
    startIcon={<ShoppingCartIcon />}
    disabled={sweet.quantity === 0 || isInCart(sweet.id)}
    onClick={handleAddToCart}
    sx={{ mt: 2 }}
  >
    {isInCart(sweet.id) ? 'Already in Cart' : 'Add to Cart'}
  </Button>

  // ... rest of the component
};