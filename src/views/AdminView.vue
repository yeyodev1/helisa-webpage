<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { productsService, type ApiProduct } from '@/services/productsService'
import { categoriesService, type ApiCategory } from '@/services/categoriesService'
import { projectsService, type ApiProject } from '@/services/projectsService'
import { usersService, type ApiUser } from '@/services/usersService'
import { uploadService } from '@/services/uploadService'
import { useUserStore } from '@/stores/user'
import type { ProductLine } from '@/data/productTypes'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref<'products' | 'categories' | 'projects' | 'users'>('products')

// Loading & Preview states
const loading = ref(false)
const uploading = ref(false)
const notification = ref<{ type: 'success' | 'error'; message: string } | null>(null)
const previewImageUrl = ref<string | null>(null)

// Local Image Previews & Pending Files
const pendingMainFile = ref<File | null>(null)
const pendingMainPreviewUrl = ref<string>('')
const pendingGalleryFiles = ref<File[]>([])
const pendingGalleryPreviews = ref<{ file: File; url: string }[]>([])

// Data lists
const products = ref<ApiProduct[]>([])
const productSearchQuery = ref('')

const filteredProducts = computed(() => {
  if (!productSearchQuery.value.trim()) return products.value
  const query = productSearchQuery.value.toLowerCase().trim()
  return products.value.filter(p => {
    return (
      p.name.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query) ||
      p.line.toLowerCase().includes(query) ||
      p.categorySlug.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    )
  })
})
const categories = ref<ApiCategory[]>([])
const projectsList = ref<ApiProject[]>([])
const users = ref<ApiUser[]>([])

// Modals
const showProductModal = ref(false)
const showCategoryModal = ref(false)
const showProjectModal = ref(false)
const showUserModal = ref(false)
const showConfirmDeleteModal = ref(false)
const deleteTarget = ref<{
  type: 'product' | 'category' | 'project' | 'user'
  idOrSlug: string
  name: string
} | null>(null)

// Product Form
const isEditingProduct = ref(false)
const currentProductId = ref<string | null>(null)
const productForm = ref<{
  name: string
  slug: string
  line: ProductLine
  categorySlug: string
  description: string
  availability: string
  image: string
  gallery: string[]
  features: string[]
  specs: { label: string; value: string }[]
}>({
  name: '',
  slug: '',
  line: 'industrial',
  categorySlug: '',
  description: '',
  availability: 'Disponible bajo pedido',
  image: '',
  gallery: [],
  features: [],
  specs: [],
})

// Filtrar categorías según la línea seleccionada en el formulario de producto
const filteredCategoriesForProduct = computed(() => {
  return categories.value.filter(c => c.line === productForm.value.line)
})

// Observar cambios en la línea para pre-seleccionar una categoría válida de esa línea
watch(
  () => productForm.value.line,
  (newLine) => {
    // Si la categoría actualmente seleccionada no pertenece a la nueva línea seleccionada
    const currentCatObj = categories.value.find(c => c.slug === productForm.value.categorySlug)
    if (!currentCatObj || currentCatObj.line !== newLine) {
      const firstValidCat = categories.value.find(c => c.line === newLine)?.slug || ''
      productForm.value.categorySlug = firstValidCat
    }
  }
)

const newFeature = ref('')
const newSpecLabel = ref('')
const newSpecValue = ref('')

// Category Form
const isEditingCategory = ref(false)
const currentCategoryId = ref<string | null>(null)
const categoryForm = ref<{
  name: string
  slug: string
  line: ProductLine
  description: string
  sourceUrl: string
}>({
  name: '',
  slug: '',
  line: 'industrial',
  description: '',
  sourceUrl: '',
})

// Project Form
const isEditingProject = ref(false)
const currentProjectId = ref<string | null>(null)
const projectForm = ref<{
  title: string
  slug: string
  category: string
  location: string
  description: string
  image: string
  gallery: string[]
  active: boolean
}>({
  title: '',
  slug: '',
  category: 'Plantas Envasadoras',
  location: '',
  description: '',
  image: '',
  gallery: [],
  active: true,
})

// User Form
const userForm = ref({
  name: '',
  email: '',
  password: '',
  role: 'admin',
})

// Notification helper
const notify = (type: 'success' | 'error', message: string) => {
  notification.value = { type, message }
  setTimeout(() => {
    notification.value = null
  }, 4000)
}

// Fetch data
const loadData = async () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    router.replace('/login')
    return
  }

  loading.value = true
  try {
    const [prodsRes, catsRes, usersRes, projsRes] = await Promise.all([
      productsService.getProducts(),
      categoriesService.getCategories(),
      usersService.getUsers().catch(() => []),
      projectsService.getProjects({ all: true }).catch(() => []),
    ])
    products.value = prodsRes
    categories.value = catsRes
    users.value = usersRes
    projectsList.value = projsRes
  } catch (err: any) {
    if (err?.status === 401) {
      userStore.clear()
      router.replace('/login')
      return
    }
    notify('error', 'Error al cargar datos del servidor.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    router.replace('/login')
    return
  }
  loadData()
})

const handleLogout = () => {
  userStore.clear()
  router.push('/login')
}

// Auto slug generator
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const onProductNameInput = () => {
  if (!isEditingProduct.value) {
    productForm.value.slug = generateSlug(productForm.value.name)
  }
}

const onCategoryNameInput = () => {
  if (!isEditingCategory.value) {
    categoryForm.value.slug = generateSlug(categoryForm.value.name)
  }
}

const onProjectTitleInput = () => {
  if (!isEditingProject.value) {
    projectForm.value.slug = generateSlug(projectForm.value.title)
  }
}

// Local image selection (previsualization first without uploading to Cloudinary yet)
const handleMainImageSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]
  if (!file) return

  pendingMainFile.value = file
  if (pendingMainPreviewUrl.value) {
    URL.revokeObjectURL(pendingMainPreviewUrl.value)
  }
  pendingMainPreviewUrl.value = URL.createObjectURL(file)
  notify('success', 'Imagen seleccionada para previsualización.')
}

const handleGalleryImageSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const selectedFiles = Array.from(target.files)
  if (selectedFiles.length > 3) {
    notify('error', 'Puedes seleccionar hasta un máximo de 3 imágenes a la vez.')
    return
  }

  for (const f of selectedFiles) {
    pendingGalleryFiles.value.push(f)
    pendingGalleryPreviews.value.push({
      file: f,
      url: URL.createObjectURL(f),
    })
  }
  notify('success', `${selectedFiles.length} foto(s) añadida(s) para previsualización.`)
}

const removePendingMainImage = () => {
  pendingMainFile.value = null
  if (pendingMainPreviewUrl.value) {
    URL.revokeObjectURL(pendingMainPreviewUrl.value)
    pendingMainPreviewUrl.value = ''
  }
  productForm.value.image = ''
  projectForm.value.image = ''
}

const removePendingGalleryImage = (index: number) => {
  const item = pendingGalleryPreviews.value[index]
  if (item) {
    URL.revokeObjectURL(item.url)
  }
  pendingGalleryPreviews.value.splice(index, 1)
  pendingGalleryFiles.value.splice(index, 1)
}

const removeExistingGalleryImage = (index: number) => {
  if (activeTab.value === 'products') {
    productForm.value.gallery.splice(index, 1)
  } else if (activeTab.value === 'projects') {
    projectForm.value.gallery.splice(index, 1)
  }
}

const clearAllPendingPreviews = () => {
  if (pendingMainPreviewUrl.value) {
    URL.revokeObjectURL(pendingMainPreviewUrl.value)
  }
  pendingMainFile.value = null
  pendingMainPreviewUrl.value = ''

  for (const item of pendingGalleryPreviews.value) {
    URL.revokeObjectURL(item.url)
  }
  pendingGalleryFiles.value = []
  pendingGalleryPreviews.value = []
}

// Feature list helpers
const addFeature = () => {
  if (newFeature.value.trim()) {
    productForm.value.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}

const removeFeature = (index: number) => {
  productForm.value.features.splice(index, 1)
}

// Spec list helpers
const addSpec = () => {
  if (newSpecLabel.value.trim() && newSpecValue.value.trim()) {
    productForm.value.specs.push({
      label: newSpecLabel.value.trim(),
      value: newSpecValue.value.trim(),
    })
    newSpecLabel.value = ''
    newSpecValue.value = ''
  }
}

const removeSpec = (index: number) => {
  productForm.value.specs.splice(index, 1)
}

// Product Open Modal
const openCreateProduct = () => {
  clearAllPendingPreviews()
  isEditingProduct.value = false
  currentProductId.value = null
  const firstCat = categories.value.find(c => c.line === 'industrial')?.slug || ''
  productForm.value = {
    name: '',
    slug: '',
    line: 'industrial',
    categorySlug: firstCat,
    description: '',
    availability: 'Disponible bajo pedido',
    image: '',
    gallery: [],
    features: [],
    specs: [],
  }
  showProductModal.value = true
}

const openEditProduct = (prod: ApiProduct) => {
  clearAllPendingPreviews()
  isEditingProduct.value = true
  currentProductId.value = prod._id || prod.slug || null
  productForm.value = {
    name: prod.name,
    slug: prod.slug,
    line: prod.line,
    categorySlug: prod.categorySlug,
    description: prod.description || '',
    availability: prod.availability || 'Disponible bajo pedido',
    image: prod.image,
    gallery: prod.gallery ? [...prod.gallery] : [],
    features: prod.features ? [...prod.features] : [],
    specs: prod.specs ? [...prod.specs] : [],
  }
  showProductModal.value = true
}

// SAVE PRODUCT
const saveProduct = async () => {
  if (!productForm.value.name || !productForm.value.categorySlug) {
    notify('error', 'Por favor ingresa el nombre y la categoría.')
    return
  }

  if (!pendingMainFile.value && !productForm.value.image) {
    notify('error', 'Debes seleccionar una imagen principal.')
    return
  }

  loading.value = true
  uploading.value = true

  try {
    if (pendingMainFile.value) {
      const mainUrls = await uploadService.uploadImages([pendingMainFile.value])
      if (mainUrls.length > 0 && mainUrls[0]) {
        productForm.value.image = mainUrls[0]
      }
    }

    if (pendingGalleryFiles.value.length > 0) {
      const galleryUrls = await uploadService.uploadImages(pendingGalleryFiles.value)
      productForm.value.gallery.push(...galleryUrls)
    }

    if (isEditingProduct.value && currentProductId.value) {
      await productsService.updateProduct(currentProductId.value, productForm.value)
      notify('success', 'Producto guardado correctamente.')
    } else {
      await productsService.createProduct(productForm.value)
      notify('success', 'Producto creado correctamente.')
    }

    clearAllPendingPreviews()
    showProductModal.value = false
    await loadData()
  } catch (err: any) {
    notify('error', err.message || 'Error al guardar el producto.')
  } finally {
    loading.value = false
    uploading.value = false
  }
}

const deleteProduct = (idOrSlug?: string) => {
  if (!idOrSlug) return
  const prod = products.value.find(p => p._id === idOrSlug || p.slug === idOrSlug)
  const name = prod ? prod.name : 'este producto'
  deleteTarget.value = { type: 'product', idOrSlug, name }
  showConfirmDeleteModal.value = true
}

// Category Handlers
const openCreateCategory = () => {
  isEditingCategory.value = false
  currentCategoryId.value = null
  categoryForm.value = {
    name: '',
    slug: '',
    line: 'industrial',
    description: '',
    sourceUrl: '',
  }
  showCategoryModal.value = true
}

const openEditCategory = (cat: ApiCategory) => {
  isEditingCategory.value = true
  currentCategoryId.value = cat._id || cat.slug || null
  categoryForm.value = {
    name: cat.name,
    slug: cat.slug,
    line: cat.line,
    description: cat.description || '',
    sourceUrl: cat.sourceUrl || '',
  }
  showCategoryModal.value = true
}

const saveCategory = async () => {
  if (!categoryForm.value.name || !categoryForm.value.slug) {
    notify('error', 'Por favor ingresa el nombre y slug de la categoría.')
    return
  }

  loading.value = true
  try {
    if (isEditingCategory.value && currentCategoryId.value) {
      await categoriesService.updateCategory(currentCategoryId.value, categoryForm.value)
      notify('success', 'Categoría actualizada correctamente.')
    } else {
      await categoriesService.createCategory(categoryForm.value)
      notify('success', 'Categoría creada correctamente.')
    }
    showCategoryModal.value = false
    await loadData()
  } catch (err: any) {
    notify('error', err.message || 'Error al guardar la categoría.')
  } finally {
    loading.value = false
  }
}

const deleteCategory = (id?: string) => {
  if (!id) return
  const cat = categories.value.find(c => c._id === id || c.slug === id)
  const name = cat ? cat.name : 'esta categoría'
  deleteTarget.value = { type: 'category', idOrSlug: id, name }
  showConfirmDeleteModal.value = true
}

// Project Handlers
const openCreateProject = () => {
  clearAllPendingPreviews()
  isEditingProject.value = false
  currentProjectId.value = null
  projectForm.value = {
    title: '',
    slug: '',
    category: 'Plantas Envasadoras',
    location: '',
    description: '',
    image: '',
    gallery: [],
    active: true,
  }
  showProjectModal.value = true
}

const openEditProject = (proj: ApiProject) => {
  clearAllPendingPreviews()
  isEditingProject.value = true
  currentProjectId.value = proj._id || proj.slug || null
  projectForm.value = {
    title: proj.title,
    slug: proj.slug,
    category: proj.category,
    location: proj.location || '',
    description: proj.description || '',
    image: proj.image,
    gallery: proj.gallery ? [...proj.gallery] : [],
    active: proj.active !== undefined ? proj.active : true,
  }
  showProjectModal.value = true
}

const toggleProjectActiveStatus = async (proj: ApiProject) => {
  if (!proj._id) return
  loading.value = true
  try {
    const res = await projectsService.toggleProjectStatus(proj._id, !proj.active)
    notify('success', res.message)
    await loadData()
  } catch (err: any) {
    notify('error', 'Error al cambiar estado del proyecto.')
  } finally {
    loading.value = false
  }
}

const saveProject = async () => {
  if (!projectForm.value.title || !projectForm.value.category) {
    notify('error', 'Por favor ingresa el título y la categoría del proyecto.')
    return
  }

  if (!pendingMainFile.value && !projectForm.value.image) {
    notify('error', 'Debes seleccionar una imagen principal.')
    return
  }

  loading.value = true
  uploading.value = true

  try {
    if (pendingMainFile.value) {
      const mainUrls = await uploadService.uploadImages([pendingMainFile.value])
      if (mainUrls.length > 0 && mainUrls[0]) {
        projectForm.value.image = mainUrls[0]
      }
    }

    if (pendingGalleryFiles.value.length > 0) {
      const galleryUrls = await uploadService.uploadImages(pendingGalleryFiles.value)
      projectForm.value.gallery.push(...galleryUrls)
    }

    if (isEditingProject.value && currentProjectId.value) {
      await projectsService.updateProject(currentProjectId.value, projectForm.value)
      notify('success', 'Proyecto guardado correctamente.')
    } else {
      await projectsService.createProject(projectForm.value)
      notify('success', 'Proyecto creado correctamente.')
    }

    clearAllPendingPreviews()
    showProjectModal.value = false
    await loadData()
  } catch (err: any) {
    notify('error', err.message || 'Error al guardar el proyecto.')
  } finally {
    loading.value = false
    uploading.value = false
  }
}

const deleteProject = (id?: string) => {
  if (!id) return
  const proj = projectsList.value.find(p => p._id === id || p.slug === id)
  const name = proj ? proj.title : 'este proyecto'
  deleteTarget.value = { type: 'project', idOrSlug: id, name }
  showConfirmDeleteModal.value = true
}

// User Handlers
const openCreateUser = () => {
  userForm.value = { name: '', email: '', password: '', role: 'admin' }
  showUserModal.value = true
}

const saveUser = async () => {
  if (!userForm.value.name || !userForm.value.email || !userForm.value.password) {
    notify('error', 'Todos los campos son obligatorios.')
    return
  }

  loading.value = true
  try {
    await usersService.createUser(userForm.value)
    notify('success', 'Usuario creado exitosamente.')
    showUserModal.value = false
    await loadData()
  } catch (err: any) {
    notify('error', err.message || 'Error al crear usuario.')
  } finally {
    loading.value = false
  }
}

const deleteUser = (id?: string) => {
  if (!id) return
  const u = users.value.find(user => user._id === id)
  const name = u ? u.name : 'este usuario'
  deleteTarget.value = { type: 'user', idOrSlug: id, name }
  showConfirmDeleteModal.value = true
}

const executeDelete = async () => {
  if (!deleteTarget.value) return
  const { type, idOrSlug } = deleteTarget.value
  showConfirmDeleteModal.value = false
  
  loading.value = true
  try {
    if (type === 'product') {
      await productsService.deleteProduct(idOrSlug)
      products.value = products.value.filter(p => p._id !== idOrSlug && p.slug !== idOrSlug)
      notify('success', 'Producto eliminado.')
    } else if (type === 'category') {
      await categoriesService.deleteCategory(idOrSlug)
      categories.value = categories.value.filter(c => c._id !== idOrSlug && c.slug !== idOrSlug)
      notify('success', 'Categoría eliminada.')
    } else if (type === 'project') {
      await projectsService.deleteProject(idOrSlug)
      projectsList.value = projectsList.value.filter(p => p._id !== idOrSlug && p.slug !== idOrSlug)
      notify('success', 'Proyecto eliminado.')
    } else if (type === 'user') {
      await usersService.deleteUser(idOrSlug)
      users.value = users.value.filter(u => u._id !== idOrSlug)
      notify('success', 'Usuario eliminado.')
    }
    await loadData()
  } catch (err: any) {
    notify('error', `Error al eliminar el/la ${type === 'product' ? 'producto' : type === 'category' ? 'categoría' : type === 'project' ? 'proyecto' : 'usuario'}.`)
  } finally {
    loading.value = false
    deleteTarget.value = null
  }
}
</script>

<template>
  <main class="admin-wrapper">
    <div class="admin-container">
      
      <!-- Top Header -->
      <header class="admin-header">
        <div class="admin-header__titles">
          <h1>Panel de Administración HELISA</h1>
          <p>Gestiona productos, categorías, proyectos y usuarios del sistema.</p>
        </div>
        <button type="button" class="btn btn--logout" @click="handleLogout">
          <i class="fa-solid fa-right-from-bracket" />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      <!-- Toast Notification -->
      <div v-if="notification" :class="['toast-notification', `toast-notification--${notification.type}`]">
        <i :class="notification.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'" />
        <span>{{ notification.message }}</span>
      </div>

      <!-- Navigation Tabs (Flex Only) -->
      <nav class="admin-tabs">
        <button
          type="button"
          :class="['tab-item', { 'tab-item--active': activeTab === 'products' }]"
          @click="activeTab = 'products'"
        >
          <i class="fa-solid fa-box-open" />
          <span>Productos ({{ products.length }})</span>
        </button>
        <button
          type="button"
          :class="['tab-item', { 'tab-item--active': activeTab === 'categories' }]"
          @click="activeTab = 'categories'"
        >
          <i class="fa-solid fa-layer-group" />
          <span>Categorías ({{ categories.length }})</span>
        </button>
        <button
          type="button"
          :class="['tab-item', { 'tab-item--active': activeTab === 'projects' }]"
          @click="activeTab = 'projects'"
        >
          <i class="fa-solid fa-diagram-project" />
          <span>Proyectos ({{ projectsList.length }})</span>
        </button>
        <button
          type="button"
          :class="['tab-item', { 'tab-item--active': activeTab === 'users' }]"
          @click="activeTab = 'users'"
        >
          <i class="fa-solid fa-users" />
          <span>Usuarios ({{ users.length }})</span>
        </button>
      </nav>

      <!-- TAB 1: PRODUCTS -->
      <section v-if="activeTab === 'products'" class="tab-panel">
        <div class="tab-panel__top">
          <h2>Catálogo de Productos ({{ filteredProducts.length }} / {{ products.length }})</h2>
          
          <!-- Buscador de Productos -->
          <div class="admin-search-box">
            <i class="fa-solid fa-magnifying-glass search-icon" />
            <input 
              v-model="productSearchQuery" 
              type="text" 
              placeholder="Buscar por nombre, slug, línea, categoría..." 
              aria-label="Buscar productos"
            />
            <button 
              v-if="productSearchQuery" 
              type="button" 
              class="clear-btn" 
              @click="productSearchQuery = ''"
              aria-label="Limpiar búsqueda"
            >
              <i class="fa-solid fa-xmark" />
            </button>
          </div>

          <button type="button" class="btn btn--primary" @click="openCreateProduct">
            <i class="fa-solid fa-plus" />
            <span>Agregar Producto</span>
          </button>
        </div>

        <div class="table-card">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Línea</th>
                <th>Categoría</th>
                <th>Disponibilidad</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prod in filteredProducts" :key="prod._id || prod.slug">
                <td>
                  <img :src="prod.image" :alt="prod.name" class="img-thumb" @click="previewImageUrl = prod.image" />
                </td>
                <td>
                  <span class="font-bold">{{ prod.name }}</span>
                  <div class="code-slug">{{ prod.slug }}</div>
                </td>
                <td><span class="badge badge--blue">{{ prod.line }}</span></td>
                <td><span class="badge badge--gray">{{ prod.categorySlug }}</span></td>
                <td>{{ prod.availability || 'Disponible' }}</td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button type="button" class="icon-btn icon-btn--edit" title="Editar" @click="openEditProduct(prod)">
                      <i class="fa-solid fa-pen" />
                    </button>
                    <button type="button" class="icon-btn icon-btn--danger" title="Eliminar" @click="deleteProduct(prod._id || prod.slug)">
                      <i class="fa-solid fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                <td colspan="6" class="empty-state">
                  {{ products.length === 0 ? 'No hay productos registrados en la base de datos.' : 'No se encontraron productos que coincidan con la búsqueda.' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 2: CATEGORIES -->
      <section v-if="activeTab === 'categories'" class="tab-panel">
        <div class="tab-panel__top">
          <h2>Gestión de Categorías ({{ categories.length }})</h2>
          <button type="button" class="btn btn--primary" @click="openCreateCategory">
            <i class="fa-solid fa-plus" />
            <span>Agregar Categoría</span>
          </button>
        </div>

        <div class="table-card">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Slug</th>
                <th>Línea</th>
                <th>Descripción</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cat in categories" :key="cat._id || cat.slug">
                <td><span class="font-bold">{{ cat.name }}</span></td>
                <td><code>{{ cat.slug }}</code></td>
                <td><span class="badge badge--blue">{{ cat.line }}</span></td>
                <td>{{ cat.description || 'Sin descripción' }}</td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button type="button" class="icon-btn icon-btn--edit" title="Editar" @click="openEditCategory(cat)">
                      <i class="fa-solid fa-pen" />
                    </button>
                    <button type="button" class="icon-btn icon-btn--danger" title="Eliminar" @click="deleteCategory(cat._id)">
                      <i class="fa-solid fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="categories.length === 0">
                <td colspan="5" class="empty-state">No hay categorías registradas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 3: PROJECTS -->
      <section v-if="activeTab === 'projects'" class="tab-panel">
        <div class="tab-panel__top">
          <h2>Gestión de Proyectos Realizados ({{ projectsList.length }})</h2>
          <button type="button" class="btn btn--primary" @click="openCreateProject">
            <i class="fa-solid fa-plus" />
            <span>Agregar Proyecto</span>
          </button>
        </div>

        <div class="table-card">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Título del Proyecto</th>
                <th>Categoría</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="proj in projectsList" :key="proj._id || proj.slug">
                <td>
                  <img :src="proj.image" :alt="proj.title" class="img-thumb" @click="previewImageUrl = proj.image" />
                </td>
                <td>
                  <span class="font-bold">{{ proj.title }}</span>
                  <div class="code-slug">{{ proj.slug }}</div>
                </td>
                <td><span class="badge badge--blue">{{ proj.category }}</span></td>
                <td>{{ proj.location || 'N/A' }}</td>
                <td>
                  <button
                    type="button"
                    :class="['status-toggle-btn', proj.active ? 'status-toggle-btn--active' : 'status-toggle-btn--inactive']"
                    :title="proj.active ? 'Clic para Desactivar Proyecto' : 'Clic para Activar Proyecto'"
                    @click="toggleProjectActiveStatus(proj)"
                  >
                    <i :class="proj.active ? 'fa-solid fa-toggle-on' : 'fa-solid fa-toggle-off'" />
                    <span>{{ proj.active ? 'Activo' : 'Inactivo' }}</span>
                  </button>
                </td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button type="button" class="icon-btn icon-btn--edit" title="Editar Proyecto" @click="openEditProject(proj)">
                      <i class="fa-solid fa-pen" />
                    </button>
                    <button type="button" class="icon-btn icon-btn--danger" title="Eliminar Proyecto" @click="deleteProject(proj._id)">
                      <i class="fa-solid fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="projectsList.length === 0">
                <td colspan="6" class="empty-state">No hay proyectos registrados en la base de datos.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 4: USERS -->
      <section v-if="activeTab === 'users'" class="tab-panel">
        <div class="tab-panel__top">
          <h2>Gestión de Usuarios ({{ users.length }})</h2>
          <button type="button" class="btn btn--primary" @click="openCreateUser">
            <i class="fa-solid fa-user-plus" />
            <span>Crear Usuario</span>
          </button>
        </div>

        <div class="table-card">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u._id">
                <td><span class="font-bold">{{ u.name }}</span></td>
                <td>{{ u.email }}</td>
                <td><span class="badge badge--gold">{{ u.role }}</span></td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button type="button" class="icon-btn icon-btn--danger" title="Eliminar Usuario" @click="deleteUser(u._id)">
                      <i class="fa-solid fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="4" class="empty-state">No hay usuarios cargados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>

    <!-- MODAL: PRODUCT -->
    <div v-if="showProductModal" class="modal-overlay" @click.self="showProductModal = false">
      <div class="modal-box">
        <div class="modal-box__head">
          <div class="modal-title-group">
            <i class="fa-solid fa-box-open modal-title-icon" />
            <h3>{{ isEditingProduct ? 'Editar Producto' : 'Crear Nuevo Producto' }}</h3>
          </div>
          <button type="button" class="close-icon" @click="showProductModal = false">×</button>
        </div>

        <form class="modal-box__body" @submit.prevent="saveProduct">
          <div class="flex-row">
            <div class="flex-field">
              <label>Nombre del Producto *</label>
              <input v-model="productForm.name" type="text" placeholder="Ej. Ablandador de Agua 10x54" required @input="onProductNameInput" />
            </div>

            <div class="flex-field">
              <label>Slug (URL) *</label>
              <input v-model="productForm.slug" type="text" placeholder="ablandador-agua-10x54" required />
            </div>
          </div>

          <div class="flex-row">
            <div class="flex-field">
              <label>Línea *</label>
              <select v-model="productForm.line">
                <option value="industrial">Industrial</option>
                <option value="domestica">Doméstica</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>

            <div class="flex-field">
              <label>Categoría *</label>
              <select v-model="productForm.categorySlug" required>
                <option v-for="c in filteredCategoriesForProduct" :key="c.slug" :value="c.slug">
                  {{ c.name }} ({{ c.line }})
                </option>
              </select>
            </div>
          </div>

          <div class="flex-field">
            <label>Disponibilidad</label>
            <input v-model="productForm.availability" type="text" placeholder="Ej. Disponible bajo pedido / Stock inmediato" />
          </div>

          <div class="flex-field">
            <label>Descripción del Producto</label>
            <textarea v-model="productForm.description" rows="3" placeholder="Ingresa una descripción detallada del producto..." />
          </div>

          <!-- LOCAL PREVISUALIZATION FOR MAIN IMAGE -->
          <div class="flex-field">
            <label>Imagen Principal *</label>
            <div class="upload-dropzone">
              <input type="file" accept="image/*" class="upload-input-hidden" @change="handleMainImageSelect" />
              <div class="dropzone-content">
                <i class="fa-solid fa-cloud-arrow-up dropzone-icon" />
                <span class="dropzone-title">Seleccionar Imagen Principal</span>
                <span class="dropzone-subtitle">Selecciona una imagen para tu producto.</span>
              </div>
            </div>

            <div v-if="pendingMainPreviewUrl || productForm.image" class="preview-badge-card">
              <div class="preview-badge-card__img-container" @click="previewImageUrl = pendingMainPreviewUrl || productForm.image">
                <img :src="pendingMainPreviewUrl || productForm.image" alt="Vista previa principal" />
                <div class="hover-zoom-hint">
                  <i class="fa-solid fa-magnifying-glass-plus" /> Ver en HD
                </div>
              </div>
              <div class="preview-meta">
                <span :class="['preview-tag', pendingMainPreviewUrl ? 'preview-tag--pending' : 'preview-tag--saved']">
                  {{ pendingMainPreviewUrl ? '• Nueva imagen seleccionada' : '• Imagen actual' }}
                </span>
                <button type="button" class="btn-remove-badge" @click="removePendingMainImage">
                  <i class="fa-solid fa-trash-can" /> Quitar
                </button>
              </div>
            </div>
          </div>

          <!-- LOCAL PREVISUALIZATION FOR GALLERY IMAGES (Up to 3 at a time) -->
          <div class="flex-field">
            <label>Galería de Fotos (Hasta 3 imágenes a la vez)</label>
            <div class="upload-dropzone">
              <input type="file" accept="image/*" multiple class="upload-input-hidden" @change="handleGalleryImageSelect" />
              <div class="dropzone-content">
                <i class="fa-solid fa-images dropzone-icon" />
                <span class="dropzone-title">Seleccionar Fotos de Galería (Max 3)</span>
                <span class="dropzone-subtitle">Selecciona hasta 3 fotos adicionales.</span>
              </div>
            </div>

            <div v-if="productForm.gallery.length > 0 || pendingGalleryPreviews.length > 0" class="gallery-grid">
              <div v-for="(img, idx) in productForm.gallery" :key="'saved-' + idx" class="gallery-card">
                <div class="gallery-card__thumb" @click="previewImageUrl = img">
                  <img :src="img" alt="Foto guardada" />
                  <div class="hover-zoom-hint">
                    <i class="fa-solid fa-magnifying-glass-plus" />
                  </div>
                </div>
                <span class="status-dot status-dot--saved" title="Imagen guardada" />
                <button type="button" class="gallery-card__del" title="Eliminar foto" @click="removeExistingGalleryImage(idx)">
                  ×
                </button>
              </div>

              <div v-for="(item, idx) in pendingGalleryPreviews" :key="'pending-' + idx" class="gallery-card gallery-card--pending">
                <div class="gallery-card__thumb" @click="previewImageUrl = item.url">
                  <img :src="item.url" alt="Previsualización local" />
                  <div class="hover-zoom-hint">
                    <i class="fa-solid fa-magnifying-glass-plus" />
                  </div>
                </div>
                <span class="status-dot status-dot--pending" title="Nueva imagen" />
                <button type="button" class="gallery-card__del" title="Quitar previsualización" @click="removePendingGalleryImage(idx)">
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- Features -->
          <div class="flex-field">
            <label>Características / Beneficios</label>
            <div class="input-inline">
              <input v-model="newFeature" type="text" placeholder="Añadir una característica..." @keyup.enter.prevent="addFeature" />
              <button type="button" class="btn btn--secondary" @click="addFeature">Agregar</button>
            </div>
            <div class="tags-column">
              <div v-for="(feat, idx) in productForm.features" :key="idx" class="tag-chip">
                <span>{{ feat }}</span>
                <button type="button" @click="removeFeature(idx)">×</button>
              </div>
            </div>
          </div>

          <!-- Specifications (Key/Value) -->
          <div class="flex-field">
            <label>Especificaciones Técnicas (Clave y Valor)</label>
            <div class="input-inline">
              <input v-model="newSpecLabel" type="text" placeholder="Etiqueta (ej. Voltaje)" />
              <input v-model="newSpecValue" type="text" placeholder="Valor (ej. 110V / 220V)" />
              <button type="button" class="btn btn--secondary" @click="addSpec">Agregar</button>
            </div>
            <div class="tags-column">
              <div v-for="(spec, idx) in productForm.specs" :key="idx" class="tag-chip">
                <span><strong>{{ spec.label }}:</strong> {{ spec.value }}</span>
                <button type="button" @click="removeSpec(idx)">×</button>
              </div>
            </div>
          </div>

          <div class="modal-box__foot">
            <button type="button" class="btn btn--outline" @click="showProductModal = false">Cancelar</button>
            <button type="submit" class="btn btn--primary" :disabled="loading || uploading">
              <i v-if="loading || uploading" class="fa-solid fa-spinner fa-spin" />
              <span v-else>Guardar Producto</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: CATEGORY -->
    <div v-if="showCategoryModal" class="modal-overlay" @click.self="showCategoryModal = false">
      <div class="modal-box modal-box--sm">
        <div class="modal-box__head">
          <div class="modal-title-group">
            <i class="fa-solid fa-layer-group modal-title-icon" />
            <h3>{{ isEditingCategory ? 'Editar Categoría' : 'Crear Categoría' }}</h3>
          </div>
          <button type="button" class="close-icon" @click="showCategoryModal = false">×</button>
        </div>

        <form class="modal-box__body" @submit.prevent="saveCategory">
          <div class="flex-field">
            <label>Nombre de la Categoría *</label>
            <input v-model="categoryForm.name" type="text" placeholder="Ej. Filtros Industriales" required @input="onCategoryNameInput" />
          </div>

          <div class="flex-field">
            <label>Slug *</label>
            <input v-model="categoryForm.slug" type="text" required />
          </div>

          <div class="flex-field">
            <label>Línea *</label>
            <select v-model="categoryForm.line">
              <option value="industrial">Industrial</option>
              <option value="domestica">Doméstica</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>

          <div class="flex-field">
            <label>Descripción</label>
            <textarea v-model="categoryForm.description" rows="3" placeholder="Descripción breve de la categoría..." />
          </div>

          <div class="modal-box__foot">
            <button type="button" class="btn btn--outline" @click="showCategoryModal = false">Cancelar</button>
            <button type="submit" class="btn btn--primary" :disabled="loading">Guardar Categoría</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: PROJECT -->
    <div v-if="showProjectModal" class="modal-overlay" @click.self="showProjectModal = false">
      <div class="modal-box">
        <div class="modal-box__head">
          <div class="modal-title-group">
            <i class="fa-solid fa-diagram-project modal-title-icon" />
            <h3>{{ isEditingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto' }}</h3>
          </div>
          <button type="button" class="close-icon" @click="showProjectModal = false">×</button>
        </div>

        <form class="modal-box__body" @submit.prevent="saveProject">
          <div class="flex-row">
            <div class="flex-field">
              <label>Título del Proyecto *</label>
              <input v-model="projectForm.title" type="text" placeholder="Ej. Planta Envasadora en Durán" required @input="onProjectTitleInput" />
            </div>

            <div class="flex-field">
              <label>Slug (URL) *</label>
              <input v-model="projectForm.slug" type="text" placeholder="planta-envasadora-duran" required />
            </div>
          </div>

          <div class="flex-row">
            <div class="flex-field">
              <label>Categoría *</label>
              <input v-model="projectForm.category" type="text" placeholder="Ej. Plantas Envasadoras / Salud" required />
            </div>

            <div class="flex-field">
              <label>Ubicación</label>
              <input v-model="projectForm.location" type="text" placeholder="Ej. Durán, Ecuador" />
            </div>
          </div>

          <div class="flex-field">
            <label>Estado del Proyecto *</label>
            <select v-model="projectForm.active">
              <option :value="true">Activo (Visible en la web)</option>
              <option :value="false">Inactivo (Oculto)</option>
            </select>
          </div>

          <div class="flex-field">
            <label>Descripción del Proyecto</label>
            <textarea v-model="projectForm.description" rows="3" placeholder="Detalles del proyecto, alcance y tecnología empleada..." />
          </div>

          <!-- Main Image Selection -->
          <div class="flex-field">
            <label>Foto Principal del Proyecto *</label>
            <div class="upload-dropzone">
              <input type="file" accept="image/*" class="upload-input-hidden" @change="handleMainImageSelect" />
              <div class="dropzone-content">
                <i class="fa-solid fa-cloud-arrow-up dropzone-icon" />
                <span class="dropzone-title">Seleccionar Foto Principal del Proyecto</span>
                <span class="dropzone-subtitle">Selecciona la foto principal del proyecto.</span>
              </div>
            </div>

            <div v-if="pendingMainPreviewUrl || projectForm.image" class="preview-badge-card">
              <div class="preview-badge-card__img-container" @click="previewImageUrl = pendingMainPreviewUrl || projectForm.image">
                <img :src="pendingMainPreviewUrl || projectForm.image" alt="Vista previa proyecto" />
                <div class="hover-zoom-hint">
                  <i class="fa-solid fa-magnifying-glass-plus" /> Ver en HD
                </div>
              </div>
              <div class="preview-meta">
                <span :class="['preview-tag', pendingMainPreviewUrl ? 'preview-tag--pending' : 'preview-tag--saved']">
                  {{ pendingMainPreviewUrl ? '• Nueva foto seleccionada' : '• Foto actual' }}
                </span>
                <button type="button" class="btn-remove-badge" @click="removePendingMainImage">
                  <i class="fa-solid fa-trash-can" /> Quitar
                </button>
              </div>
            </div>
          </div>

          <!-- Gallery Images Selection -->
          <div class="flex-field">
            <label>Galería del Proyecto (Hasta 3 imágenes a la vez)</label>
            <div class="upload-dropzone">
              <input type="file" accept="image/*" multiple class="upload-input-hidden" @change="handleGalleryImageSelect" />
              <div class="dropzone-content">
                <i class="fa-solid fa-images dropzone-icon" />
                <span class="dropzone-title">Seleccionar Fotos Adicionales (Max 3)</span>
              </div>
            </div>

            <div v-if="projectForm.gallery.length > 0 || pendingGalleryPreviews.length > 0" class="gallery-grid">
              <div v-for="(img, idx) in projectForm.gallery" :key="'saved-proj-' + idx" class="gallery-card">
                <div class="gallery-card__thumb" @click="previewImageUrl = img">
                  <img :src="img" alt="Foto proyecto" />
                </div>
                <span class="status-dot status-dot--saved" title="Imagen guardada" />
                <button type="button" class="gallery-card__del" title="Eliminar foto" @click="removeExistingGalleryImage(idx)">
                  ×
                </button>
              </div>

              <div v-for="(item, idx) in pendingGalleryPreviews" :key="'pending-proj-' + idx" class="gallery-card gallery-card--pending">
                <div class="gallery-card__thumb" @click="previewImageUrl = item.url">
                  <img :src="item.url" alt="Previsualización local" />
                </div>
                <span class="status-dot status-dot--pending" title="Nueva imagen" />
                <button type="button" class="gallery-card__del" title="Quitar previsualización" @click="removePendingGalleryImage(idx)">
                  ×
                </button>
              </div>
            </div>
          </div>

          <div class="modal-box__foot">
            <button type="button" class="btn btn--outline" @click="showProjectModal = false">Cancelar</button>
            <button type="submit" class="btn btn--primary" :disabled="loading || uploading">
              <i v-if="loading || uploading" class="fa-solid fa-spinner fa-spin" />
              <span v-else>Guardar Proyecto</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: USER -->
    <div v-if="showUserModal" class="modal-overlay" @click.self="showUserModal = false">
      <div class="modal-box modal-box--sm">
        <div class="modal-box__head">
          <div class="modal-title-group">
            <i class="fa-solid fa-user-shield modal-title-icon" />
            <h3>Crear Nuevo Usuario</h3>
          </div>
          <button type="button" class="close-icon" @click="showUserModal = false">×</button>
        </div>

        <form class="modal-box__body" @submit.prevent="saveUser">
          <div class="flex-field">
            <label>Nombre Completo *</label>
            <input v-model="userForm.name" type="text" placeholder="Ej. Diego Reyes" required />
          </div>

          <div class="flex-field">
            <label>Correo Electrónico *</label>
            <input v-model="userForm.email" type="email" placeholder="ejemplo@bakano.ec" required />
          </div>

          <div class="flex-field">
            <label>Contraseña *</label>
            <input v-model="userForm.password" type="password" placeholder="••••••••" required />
          </div>

          <div class="modal-box__foot">
            <button type="button" class="btn btn--outline" @click="showUserModal = false">Cancelar</button>
            <button type="submit" class="btn btn--primary" :disabled="loading">Crear Usuario</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: CONFIRM DELETE -->
    <div v-if="showConfirmDeleteModal && deleteTarget" class="modal-overlay" @click.self="showConfirmDeleteModal = false">
      <div class="modal-box modal-box--sm confirm-delete-box">
        <div class="modal-box__head">
          <div class="modal-title-group warning-title">
            <i class="fa-solid fa-triangle-exclamation modal-title-icon" />
            <h3>Confirmar Eliminación</h3>
          </div>
          <button type="button" class="close-icon" @click="showConfirmDeleteModal = false">×</button>
        </div>

        <div class="modal-box__body confirm-delete-body">
          <p class="confirm-message">
            ¿Estás seguro de que deseas eliminar permanentemente el siguiente elemento?
          </p>
          <div class="confirm-target-card">
            <span class="confirm-target-type">
              {{ deleteTarget.type === 'product' ? 'Producto' : deleteTarget.type === 'category' ? 'Categoría' : deleteTarget.type === 'project' ? 'Proyecto' : 'Usuario' }}
            </span>
            <span class="confirm-target-name">{{ deleteTarget.name }}</span>
          </div>
          <p class="confirm-warning-note">
            <i class="fa-solid fa-circle-info" /> Esta acción es irreversible y afectará los datos relacionados.
          </p>

          <div class="modal-box__foot">
            <button type="button" class="btn btn--outline" @click="showConfirmDeleteModal = false" :disabled="loading">
              Cancelar
            </button>
            <button type="button" class="btn btn--danger" @click="executeDelete" :disabled="loading">
              <i v-if="loading" class="fa-solid fa-spinner fa-spin" />
              <span v-else>Sí, Eliminar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- LIGHTBOX: Fullscreen Image Preview -->
    <div v-if="previewImageUrl" class="lightbox-overlay" @click.self="previewImageUrl = null">
      <div class="lightbox-box">
        <button type="button" class="lightbox-close" @click="previewImageUrl = null">
          <i class="fa-solid fa-xmark" />
        </button>
        <img :src="previewImageUrl" alt="Previsualización de foto en HD" class="lightbox-img" />
      </div>
    </div>

  </main>
</template>

<style lang="scss" scoped>
.admin-wrapper {
  width: 100%;
  min-height: 100vh;
  padding-top: 130px; /* Ensures clearance below the fixed navbar */
  padding-bottom: 60px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.admin-container {
  width: 100%;
  max-width: 1280px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.admin-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  &__titles {
    display: flex;
    flex-direction: column;

    h1 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px 0;
    }

    p {
      font-size: 0.95rem;
      color: #64748b;
      margin: 0;
    }
  }
}

.toast-notification {
  width: 100%;
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  box-sizing: border-box;

  &--success {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  &--error {
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }
}

/* Tabs with FLEX ONLY */
.admin-tabs {
  display: flex;
  flex-direction: row;
  gap: 12px;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 24px;
  width: 100%;

  @media (max-width: 600px) {
    overflow-x: auto;
    padding-bottom: 4px;
  }
}

.tab-item {
  background: none;
  border: none;
  padding: 12px 20px;
  font-size: 0.98rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &--active {
    color: #0052cc;
    border-bottom-color: #0052cc;
  }
}

.tab-panel {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
  }
}

/* --- Buscador del Admin Panel --- */
.admin-search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 20px;

  .search-icon {
    position: absolute;
    left: 14px;
    color: #94a3b8;
    font-size: 0.9rem;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 0.9rem;
    color: #0f172a;
    background: #f8fafc;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #0052cc;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.12);
    }
  }

  .clear-btn {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 4px;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease;

    &:hover {
      color: #ef4444;
    }
  }
}

@media (max-width: 768px) {
  .tab-panel__top {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;

    .admin-search-box {
      max-width: 100%;
      margin: 0;
    }
  }
}

.table-card {
  width: 100%;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th, td {
    padding: 14px 18px;
    border-bottom: 1px solid #f1f5f9;
  }

  th {
    background: #f8fafc;
    font-size: 0.8rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .img-thumb {
    width: 46px;
    height: 46px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }

  .font-bold {
    font-weight: 600;
    color: #0f172a;
  }

  .code-slug {
    font-size: 0.78rem;
    color: #64748b;
    font-family: monospace;
  }

  .badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    display: inline-block;

    &--blue {
      background: #e0f2fe;
      color: #0369a1;
    }

    &--gray {
      background: #f1f5f9;
      color: #475569;
    }

    &--gold {
      background: #fef3c7;
      color: #92400e;
    }
  }

  .status-toggle-btn {
    padding: 6px 12px;
    border-radius: 100px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid transparent;
    transition: all 0.2s ease;

    &--active {
      background: #ecfdf5;
      color: #047857;
      border-color: #a7f3d0;

      &:hover {
        background: #fef2f2;
        color: #dc2626;
        border-color: #fecaca;
      }
    }

    &--inactive {
      background: #fef2f2;
      color: #b91c1c;
      border-color: #fecaca;

      &:hover {
        background: #ecfdf5;
        color: #047857;
        border-color: #a7f3d0;
      }
    }
  }

  .action-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: #94a3b8;
  }
}

.text-right {
  text-align: right;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &--edit:hover {
    background: #eff6ff;
    color: #2563eb;
    border-color: #2563eb;
  }

  &--danger:hover {
    background: #fef2f2;
    color: #dc2626;
    border-color: #dc2626;
  }
}

/* HIGH-END MODAL OVERLAY & BOX */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(10px) saturate(180%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 24px;
  box-sizing: border-box;
  animation: overlayFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-box {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 680px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 0 1px 1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
  animation: modalPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &--sm {
    max-width: 460px;
  }

  &__head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 28px;
    background: #ffffff;
    border-bottom: 1px solid #f1f5f9;

    .modal-title-group {
      display: flex;
      align-items: center;
      gap: 12px;

      .modal-title-icon {
        font-size: 1.25rem;
        color: #0052cc;
        background: #ebf5ff;
        padding: 8px;
        border-radius: 10px;
      }

      h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
      }
    }

    .close-icon {
      background: #f1f5f9;
      border: none;
      font-size: 1.4rem;
      color: #64748b;
      cursor: pointer;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      &:hover {
        background: #e2e8f0;
        color: #0f172a;
      }
    }
  }

  &__body {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    background: #ffffff;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
  }

  &__foot {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 10px;
    padding-top: 20px;
    border-top: 1px solid #f1f5f9;
  }
}

@keyframes modalPopIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Form Layout & Fields */
.flex-row {
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
  }
}

.flex-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;

  label {
    font-size: 0.86rem;
    font-weight: 600;
    color: #334155;
  }

  input, select, textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 0.92rem;
    color: #0f172a;
    background: #f8fafc;
    box-sizing: border-box;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      background: #ffffff;
      border-color: #0052cc;
      box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.12);
    }
  }
}

/* Cloudinary Upload Dropzone & Local Previews */
.upload-dropzone {
  position: relative;
  width: 100%;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background: #f0f7ff;
    border-color: #0052cc;

    .dropzone-icon {
      color: #0052cc;
      transform: translateY(-2px);
    }
  }

  .upload-input-hidden {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    pointer-events: none;
  }

  .dropzone-icon {
    font-size: 1.8rem;
    color: #64748b;
    transition: all 0.2s ease;
  }

  .dropzone-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1e293b;
  }

  .dropzone-subtitle {
    font-size: 0.78rem;
    color: #94a3b8;
  }
}

.preview-badge-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 12px 16px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;

  &__img-container {
    position: relative;
    width: 70px;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid #cbd5e1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .hover-zoom-hint {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      color: #ffffff;
      font-size: 0.68rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover {
      img { transform: scale(1.08); }
      .hover-zoom-hint { opacity: 1; }
    }
  }

  .preview-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .preview-tag {
    font-size: 0.75rem;
    font-weight: 600;

    &--pending {
      color: #d97706;
    }

    &--saved {
      color: #059669;
    }
  }

  .btn-remove-badge {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;

    &:hover {
      background: #dc2626;
      color: #ffffff;
    }
  }
}

.gallery-grid {
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 8px;
}

.gallery-card {
  position: relative;
  width: 72px;
  height: 72px;

  &--pending {
    .gallery-card__thumb {
      border: 2px dashed #f59e0b;
    }
  }

  &__thumb {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #cbd5e1;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .hover-zoom-hint {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover {
      img { transform: scale(1.1); }
      .hover-zoom-hint { opacity: 1; }
    }
  }

  .status-dot {
    position: absolute;
    bottom: -2px;
    left: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #ffffff;

    &--saved { background: #10b981; }
    &--pending { background: #f59e0b; }
  }

  &__del {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

    &:hover {
      background: #b91c1c;
      transform: scale(1.1);
    }
  }
}

/* Lightbox Modal */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  box-sizing: border-box;
}

.lightbox-box {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .lightbox-img {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    object-fit: contain;
  }

  .lightbox-close {
    position: absolute;
    top: -18px;
    right: -18px;
    background: #ffffff;
    color: #0f172a;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

    &:hover {
      background: #f1f5f9;
    }
  }
}

.input-inline {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
}

.tags-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 6px;
}

.tag-chip {
  background: #f1f5f9;
  padding: 8px 14px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  width: 100%;
  box-sizing: border-box;

  button {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
  }
}

.btn {
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &--primary {
    background: #0052cc;
    color: #ffffff;

    &:hover:not(:disabled) {
      background: #003e99;
    }
  }

  &--secondary {
    background: #e2e8f0;
    color: #334155;

    &:hover { background: #cbd5e1; }
  }

  &--outline {
    background: transparent;
    border: 1px solid #cbd5e1;
    color: #475569;

    &:hover { background: #f1f5f9; }
  }

  &--logout {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    color: #64748b;

    &:hover {
      background: #fef2f2;
      color: #dc2626;
      border-color: #fecaca;
    }
  }

  &--danger {
    background: #e2352c;
    color: #ffffff;

    &:hover:not(:disabled) {
      background: #b92019;
    }
  }
}

/* --- Confirm Delete Modal --- */
.confirm-delete-box {
  border-top: 4px solid #e2352c;
}

.warning-title {
  color: #e2352c !important;
}

.confirm-delete-body {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .confirm-message {
    font-size: 0.95rem;
    color: #475569;
    margin: 0;
  }

  .confirm-target-card {
    background: #fef2f2;
    border-left: 4px solid #e2352c;
    padding: 12px 16px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .confirm-target-type {
    font-size: 0.72rem;
    font-weight: 700;
    color: #e2352c;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .confirm-target-name {
    font-size: 1.05rem;
    font-weight: 600;
    color: #0f172a;
    word-break: break-all;
  }

  .confirm-warning-note {
    font-size: 0.8rem;
    color: #ef4444;
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    background: #fff5f5;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid rgba(#ef4444, 0.12);
  }
}
</style>
