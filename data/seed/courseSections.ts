import type { CourseSection } from '@/types/models';

/** Layer 1 — Krish Naik CV course, in order. Durations converted to minutes. See PRD §4. */
export const courseSectionsSeed: CourseSection[] = [
  {
    id: 'python-prerequisites',
    title: 'Python Prerequisites',
    videoCount: 43,
    durationMinutes: 712, // 11h52m
    status: 'not_started',
    skimFlag: true,
    sortOrder: 1,
    notes: 'Skim-flagged — bulk-mark known sub-groups instead of watching all 43 videos (§4.1).',
  },
  {
    id: 'intro-to-deep-learning',
    title: 'Introduction to Deep Learning',
    videoCount: 2,
    durationMinutes: 21,
    status: 'not_started',
    skimFlag: false,
    sortOrder: 2,
    notes: null,
  },
  {
    id: 'dl-ann-optimizers-loss-activation-cnn-theory',
    title: 'DL — ANN, Optimizers, Loss, Activation, CNN Theory',
    videoCount: 37,
    durationMinutes: 383, // 6h23m
    status: 'not_started',
    skimFlag: false,
    sortOrder: 3,
    notes: "Pause for 3Blue1Brown if backprop doesn't land.",
  },
  {
    id: 'computer-vision-opencv',
    title: 'Computer Vision (OpenCV with Python)',
    videoCount: 20,
    durationMinutes: 581, // 9h41m
    status: 'not_started',
    skimFlag: false,
    sortOrder: 4,
    notes: null,
  },
  {
    id: 'pytorch',
    title: 'PyTorch',
    videoCount: 24,
    durationMinutes: 634, // 10h34m
    status: 'not_started',
    skimFlag: false,
    sortOrder: 5,
    notes: 'Core section — primary framework, go slow.',
  },
  {
    id: 'deep-dive-visualizing-cnns',
    title: 'Deep Dive Visualizing CNNs',
    videoCount: 8,
    durationMinutes: 123, // 2h03m
    status: 'not_started',
    skimFlag: false,
    sortOrder: 6,
    notes: null,
  },
  {
    id: 'image-classification',
    title: 'Image Classification',
    videoCount: 20,
    durationMinutes: 237, // 3h57m
    status: 'not_started',
    skimFlag: false,
    sortOrder: 7,
    notes: null,
  },
  {
    id: 'data-augmentation',
    title: 'Data Augmentation',
    videoCount: 3,
    durationMinutes: 30,
    status: 'not_started',
    skimFlag: false,
    sortOrder: 8,
    notes: 'Quick win, good for low-energy days.',
  },
  {
    id: 'basics-of-object-detection',
    title: 'Basics of Object Detection',
    videoCount: 12,
    durationMinutes: 227, // 3h47m
    status: 'not_started',
    skimFlag: false,
    sortOrder: 9,
    notes: null,
  },
  {
    id: 'image-segmentation',
    title: 'Image Segmentation',
    videoCount: 10,
    durationMinutes: 295, // 4h55m
    status: 'not_started',
    skimFlag: false,
    sortOrder: 10,
    notes: null,
  },
  {
    id: 'project-001-yolo-image-search-app',
    title: 'Project 001 — YOLO Powered Image Search App',
    videoCount: 9,
    durationMinutes: 328, // 5h28m
    status: 'not_started',
    skimFlag: false,
    sortOrder: 11,
    notes: 'Ship this even if rushed.',
  },
];
