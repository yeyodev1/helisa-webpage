export interface ProjectRelatedProduct {
  label: string
  to: string
}

export interface Project {
  id: number
  slug: string
  title: string
  category: string
  location?: string
  description: string
  image: string
  gallery: string[]
  highlights: string[]
  relatedProducts: ProjectRelatedProduct[]
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'petro-ecuador',
    title: 'Petro Ecuador',
    category: 'Industria Petrolera',
    location: 'Ecuador',
    description: 'Sistema de tratamiento de agua para operaciones petroleras con altos estándares de calidad.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372953/helisa/projects/petro-ecuador.png',
    gallery: ['https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372953/helisa/projects/petro-ecuador.png'],
    highlights: [
      'Tratamiento orientado a operación continua.',
      'Control de parámetros para entornos industriales exigentes.',
      'Arquitectura de solución adaptable a procesos de campo.',
    ],
    relatedProducts: [
      { label: 'Ósmosis Inversa', to: '/productos#osmosis-inversa' },
      { label: 'Ozono', to: '/productos#ozono' },
    ],
  },
  {
    id: 3,
    slug: 'repsol-duragas',
    title: 'Repsol Duragas',
    category: 'Industria Petrolera',
    location: 'Ecuador',
    description: 'Soluciones de filtración y tratamiento para procesos industriales.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372955/helisa/projects/repsol-duragas.png',
    gallery: ['https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372955/helisa/projects/repsol-duragas.png'],
    highlights: [
      'Sistema pensado para procesos de alta demanda.',
      'Integración de filtración y tratamiento sanitario.',
      'Enfoque en continuidad operativa y control.',
    ],
    relatedProducts: [{ label: 'Ozono', to: '/productos#ozono' }],
  },
  {
    id: 5,
    slug: 'laboratorios-indunidas',
    title: 'Laboratorios Indunidas',
    category: 'Laboratorios',
    location: 'Ecuador',
    description: 'Sistema de desmineralización para procesos farmacéuticos.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372953/helisa/projects/laboratorio-indunidas.png',
    gallery: ['https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372953/helisa/projects/laboratorio-indunidas.png'],
    highlights: [
      'Desmineralización para procesos de precisión.',
      'Calidad de agua orientada a laboratorio.',
      'Soporte para trazabilidad y control técnico.',
    ],
    relatedProducts: [
      { label: 'Esterilización UV', to: '/productos#esterilizacion-uv' },
      { label: 'Ósmosis Inversa', to: '/productos#osmosis-inversa' },
    ],
  },
  {
    id: 7,
    slug: 'agua-latina-playas',
    title: 'Agua Latina en Playas',
    category: 'Plantas Envasadoras',
    location: 'Playas',
    description: 'Planta envasadora con sistema completo de tratamiento y purificación.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372947/helisa/projects/agua-latina-playas.jpg',
    gallery: ['https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372947/helisa/projects/agua-latina-playas.jpg'],
    highlights: [
      'Diseño para línea de envasado y tratamiento continuo.',
      'Control de calidad previo al embotellado.',
      'Escalabilidad para crecimiento de producción.',
    ],
    relatedProducts: [
      { label: 'Ósmosis Inversa', to: '/productos#osmosis-inversa' },
      { label: 'Esterilización UV', to: '/productos#esterilizacion-uv' },
    ],
  },
  {
    id: 13,
    slug: 'avicola-2007',
    title: 'Avícola 2007',
    category: 'Sector Agrícola',
    location: 'Ecuador',
    description: 'Tratamiento de agua para procesos avícolas y faenamiento.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372948/helisa/projects/avicola-2007.jpg',
    gallery: ['https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372948/helisa/projects/avicola-2007.jpg'],
    highlights: [
      'Sanidad aplicada a procesos productivos sensibles.',
      'Reducción de carga microbiológica.',
      'Solución compatible con operación agroindustrial.',
    ],
    relatedProducts: [
      { label: 'Ozono', to: '/productos#ozono' },
      { label: 'Esterilización UV', to: '/productos#esterilizacion-uv' },
    ],
  },
  {
    id: 17,
    slug: 'hospital-miguel-h-alcivar',
    title: 'Hospital Miguel H. Alcívar',
    category: 'Sector de Salud',
    location: 'Ecuador',
    description: 'Sistema de tratamiento y desinfección de agua para áreas hospitalarias y puntos críticos.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372899/helisa/projects/imagen-agua.jpg',
    gallery: [
      'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372899/helisa/projects/imagen-agua.jpg',
      'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372958/helisa/projects/edificio-helisa.jpg',
    ],
    highlights: [
      'Enfoque sanitario para áreas críticas.',
      'Diseño orientado a seguridad y continuidad.',
      'Solución ideal para esterilización y control de agua.',
    ],
    relatedProducts: [{ label: 'Esterilización UV', to: '/productos#esterilizacion-uv' }],
  },
  {
    id: 19,
    slug: 'sonesta',
    title: 'Sonesta',
    category: 'Sector de Turismo',
    location: 'Ecuador',
    description: 'Tratamiento de agua para cadena hotelera de lujo.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372955/helisa/projects/sonesta.jpg',
    gallery: ['https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372955/helisa/projects/sonesta.jpg'],
    highlights: [
      'Experiencia premium en sector hotelero.',
      'Tratamiento confiable para servicios al huésped.',
      'Solución pensada para operación continua.',
    ],
    relatedProducts: [
      { label: 'Ósmosis Inversa', to: '/productos#osmosis-inversa' },
      { label: 'Ozono', to: '/productos#ozono' },
    ],
  },
  {
    id: 20,
    slug: 'colegio-en-duran',
    title: 'Colegio en Durán',
    category: 'Sector Educativo',
    location: 'Durán',
    description: 'Sistema de agua potable para institución educativa.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372950/helisa/projects/colegio-duran.jpg',
    gallery: ['https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372950/helisa/projects/colegio-duran.jpg'],
    highlights: [
      'Agua segura para comunidad educativa.',
      'Solución de fácil mantenimiento.',
      'Tecnología adecuada para uso diario intensivo.',
    ],
    relatedProducts: [
      { label: 'Esterilización UV', to: '/productos#esterilizacion-uv' },
      { label: 'Ósmosis Inversa', to: '/productos#osmosis-inversa' },
    ],
  },
  {
    id: 22,
    slug: 'celec',
    title: 'Proyecto CELEC',
    category: 'Sector Industrial',
    location: 'Ecuador',
    description: 'Tratamiento de agua para procesos de generación eléctrica.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372950/helisa/projects/celec.png',
    gallery: ['https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372950/helisa/projects/celec.png'],
    highlights: [
      'Soporte a operación industrial crítica.',
      'Tratamiento estable para procesos de energía.',
      'Diseño enfocado en confiabilidad.',
    ],
    relatedProducts: [{ label: 'Ósmosis Inversa', to: '/productos#osmosis-inversa' }],
  },
  {
    id: 23,
    slug: 'casa-estancias-del-rio',
    title: 'Casa en Estancias del Río',
    category: 'Tratamiento Hogar',
    location: 'Samborondón',
    description: 'Sistema doméstico de purificación de agua completo.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372949/helisa/projects/casa-estancias.jpg',
    gallery: ['https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372949/helisa/projects/casa-estancias.jpg'],
    highlights: [
      'Purificación pensada para uso residencial.',
      'Instalación compacta y eficiente.',
      'Agua segura para toda la familia.',
    ],
    relatedProducts: [{ label: 'Ósmosis Inversa', to: '/productos#osmosis-inversa' }],
  },
  {
    id: 24,
    slug: 'edificio-helisa',
    title: 'Edificio Helisa',
    category: 'Tratamiento Hogar',
    location: 'Guayaquil',
    description: 'Tratamiento integral de agua para edificio corporativo.',
    image: 'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372958/helisa/projects/edificio-helisa.jpg',
    gallery: [
      'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372958/helisa/projects/edificio-helisa.jpg',
      'https://res.cloudinary.com/bmtcnrkr/image/upload/v1783372899/helisa/projects/imagen-agua.jpg',
    ],
    highlights: [
      'Integración de tratamiento para operación corporativa.',
      'Instalación visible y representativa de la marca.',
      'Solución adaptable a edificio y servicios comunes.',
    ],
    relatedProducts: [
      { label: 'Ósmosis Inversa', to: '/productos#osmosis-inversa' },
      { label: 'Esterilización UV', to: '/productos#esterilizacion-uv' },
    ],
  },
]

export const projectCategories = [
  'Todos',
  'Industria Petrolera',
  'Laboratorios',
  'Plantas Envasadoras',
  'Potabilización y PTAR',
  'Sector Agrícola',
  'Sector de Salud',
  'Sector de Turismo',
  'Sector Educativo',
  'Sector Industrial',
  'Tratamiento Hogar',
]

export const getProjectBySlug = (slug: string) => projects.find((project) => project.slug === slug)
