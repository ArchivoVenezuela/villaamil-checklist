import type { Checklist } from '@/types/checklist'

export const villaamilReturn: Checklist = {
  id: 'return',
  title: 'Apertura del piso',
  subtitle: 'Villaamil · Madrid',
  description: 'Checklist de apertura al llegar a Madrid',
  icon: '🏠',
  completionMessage: '¡El piso está listo! Bienvenido de vuelta.',
  notesLabel: 'Notas de la llegada',
  notesPlaceholder: 'Estado del piso al llegar, incidencias, cosas a comprar…',
  sections: [
    {
      id: 'entrada',
      title: 'Entrada',
      icon: '🔑',
      order: 1,
      tasks: [
        { id: 'ret-ent-1', title: 'Abrir la puerta principal' },
        { id: 'ret-ent-2', title: 'Comprobar visualmente el estado de la entrada' },
      ],
    },
    {
      id: 'instalaciones',
      title: 'Instalaciones generales',
      icon: '💧',
      order: 2,
      tasks: [
        { id: 'ret-gen-1', title: 'Abrir la llave general del agua', critical: true },
        {
          id: 'ret-gen-2',
          title: 'Revisar que no haya fugas tras abrir el agua',
          critical: true,
        },
        { id: 'ret-gen-3', title: 'Encender el calentador de agua', critical: true },
      ],
    },
    {
      id: 'cocina',
      title: 'Cocina',
      icon: '🍽',
      order: 3,
      tasks: [
        { id: 'ret-coc-1', title: 'Conectar el frigorífico' },
        {
          id: 'ret-coc-2',
          title: 'Esperar al menos 2 horas antes de llenarlo',
          note: 'Tiempo recomendado por el fabricante para que el compresor se estabilice',
        },
        { id: 'ret-coc-3', title: 'Cerrar las puertas del frigorífico' },
        { id: 'ret-coc-4', title: 'Conectar el microondas' },
        { id: 'ret-coc-5', title: 'Conectar el air fryer' },
        { id: 'ret-coc-6', title: 'Revisar grifos de cocina' },
      ],
    },
    {
      id: 'lavadero',
      title: 'Lavadero',
      icon: '🧺',
      order: 4,
      tasks: [
        {
          id: 'ret-lav-1',
          title: 'Abrir llaves de paso de lavadora y lavavajillas si se cerraron',
        },
        { id: 'ret-lav-2', title: 'Cerrar la puerta de la lavadora' },
        { id: 'ret-lav-3', title: 'Cerrar la puerta del lavavajillas' },
      ],
    },
    {
      id: 'dormitorio',
      title: 'Dormitorio',
      icon: '🛏',
      order: 5,
      tasks: [
        {
          id: 'ret-dorm-1',
          title: 'Conectar el router',
          note: 'Está guardado en la gaveta de la cama, la más cercana al armario',
        },
        { id: 'ret-dorm-2', title: 'Esperar a que el router tenga conexión' },
        { id: 'ret-dorm-3', title: 'Conectar los ventiladores' },
      ],
    },
    {
      id: 'salon',
      title: 'Salón',
      icon: '🛋',
      order: 6,
      tasks: [
        { id: 'ret-sal-1', title: 'Abrir ventanas para ventilar el piso' },
        { id: 'ret-sal-2', title: 'Revisar persianas' },
        { id: 'ret-sal-3', title: 'Comprobar electricidad y enchufes' },
        { id: 'ret-sal-4', title: 'Encender luces para comprobar que funcionan' },
      ],
    },
    {
      id: 'bano',
      title: 'Baño',
      icon: '🚿',
      order: 7,
      tasks: [
        { id: 'ret-ban-1', title: 'Abrir el grifo para purgar el agua de las tuberías' },
        { id: 'ret-ban-2', title: 'Revisar que no haya humedad ni olores' },
        { id: 'ret-ban-3', title: 'Comprobar el funcionamiento del calentador' },
      ],
    },
    {
      id: 'revision',
      title: 'Revisión final',
      icon: '✅',
      order: 8,
      tasks: [
        { id: 'ret-rev-1', title: 'Recorrer todas las habitaciones' },
        { id: 'ret-rev-2', title: 'Revisar olores o humedad en general' },
        { id: 'ret-rev-3', title: 'Confirmar que todo está en orden' },
      ],
    },
  ],
}
