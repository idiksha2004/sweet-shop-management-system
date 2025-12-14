// ... existing imports ...
import SweetCard from '../../components/sweets/SweetCard';

const SweetListPage = () => {
  // ... existing code ...

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* ... existing header and filters ... */}

      {sweets.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No sweets found. Try adjusting your search criteria.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {sweets.map((sweet) => (
            <Grid item key={sweet.id} xs={12} sm={6} md={4} lg={3}>
              <SweetCard sweet={sweet} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SweetListPage;