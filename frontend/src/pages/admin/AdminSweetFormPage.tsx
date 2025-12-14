import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { sweetService } from '../../api/sweet.service';

const sweetSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive'),
  quantity: Yup.number()
    .required('Quantity is required')
    .integer('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative'),
  category: Yup.string().required('Category is required'),
});

const AdminSweetFormPage = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  // Fetch sweet data if in edit mode
  const { data: sweet, isLoading } = useQuery(
    ['sweet', id],
    () => sweetService.getSweetById(id!),
    {
      enabled: isEdit && !!id,
    }
  );

  // Create or update mutation
  const mutation = useMutation(
    (data: any) =>
      isEdit && id
        ? sweetService.updateSweet(id, data)
        : sweetService.createSweet(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['sweets']);
        queryClient.invalidateQueries(['sweet', id]);
        navigate(isEdit ? `/sweets/${id}` : '/admin');
      },
      onError: (err: any) => {
        setError(err.message || 'An error occurred');
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      category: '',
    },
    validationSchema: sweetSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  // Set form values when sweet data is loaded (edit mode)
  useEffect(() => {
    if (sweet) {
      formik.setValues({
        name: sweet.name,
        description: sweet.description || '',
        price: sweet.price,
        quantity: sweet.quantity,
        category: sweet.category,
      });
    }
  }, [sweet]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/admin" color="inherit">
          Admin
        </Link>
        <Link
          component={RouterLink}
          to={isEdit ? `/sweets/${id}` : '/admin'}
          color="inherit"
        >
          {isEdit ? sweet?.name || 'Edit Sweet' : 'Sweets'}
        </Link>
        <Typography color="text.primary">
          {isEdit ? 'Edit' : 'Create New'} Sweet
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          {isEdit ? 'Edit Sweet' : 'Add New Sweet'}
        </Typography>
        <Button
          component={RouterLink}
          to={isEdit ? `/sweets/${id}` : '/admin'}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
      </Box>

      <Card>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Sweet Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="price"
                  name="price"
                  label="Price"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="quantity"
                  name="quantity"
                  label="Quantity in Stock"
                  type="number"
                  inputProps={{ min: '0' }}
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.quantity && Boolean(formik.errors.quantity)
                  }
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    label="Category"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.category && Boolean(formik.errors.category)
                    }
                  >
                    <MenuItem value="Chocolate">Chocolate</MenuItem>
                    <MenuItem value="Candy">Candy</MenuItem>
                    <MenuItem value="Pastry">Pastry</MenuItem>
                    <MenuItem value="Cake">Cake</MenuItem>
                    <MenuItem value="Cookie">Cookie</MenuItem>
                    <MenuItem value="Ice Cream">Ice Cream</MenuItem>
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {formik.errors.category}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                  }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    disabled={mutation.isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={mutation.isLoading}
                    startIcon={
                      mutation.isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                  >
                    {mutation.isLoading
                      ? 'Saving...'
                      : isEdit
                      ? 'Update Sweet'
                      : 'Create Sweet'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminSweetFormPage;