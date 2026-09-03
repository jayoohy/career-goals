import type { RoadmapSubStep } from '@/types/models';

/**
 * Starter checklists for the built-in roadmap items — the roadmap equivalent of a course
 * section's video list, so finishing the course doesn't drop Joy into a set of vague many-hour
 * blobs with nothing to tick. These are a reasonable first pass, not gospel: every step can be
 * renamed, checked, reordered, or deleted, and Joy can add her own. Items she adds herself
 * start with an empty checklist.
 *
 * Keyed by roadmap item id (see data/seed/roadmapItems.ts).
 */
const STEPS_BY_ITEM: Record<string, string[]> = {
  'fastai-practical-deep-learning': [
    'Lesson 1 — Getting started',
    'Lesson 2 — Deployment',
    'Lesson 3 — Neural net foundations',
    'Lesson 4 — Natural language (NLP)',
    'Lesson 5 — From-scratch model',
    'Lesson 6 — Random forests',
    'Lesson 7 — Collaborative filtering & embeddings',
    'Lesson 8 — Convolutions (CNNs)',
    'Build one project end-to-end from what the course covered',
  ],
  'cpp-fundamentals-ros-sensor-fusion': [
    'C++ basics — types, references, headers, CMake',
    'C++ — classes, RAII, smart pointers, STL containers',
    'ROS 2 — nodes, topics, publishers & subscribers',
    'ROS 2 — services, actions, parameters, launch files',
    'ROS 2 — colcon workspace, packages, tf2 transforms',
    'Sensor fusion — coordinate frames & calibration basics',
    'Sensor fusion — Kalman / EKF on a simple example',
    'Integration — publish sensor data, fuse it, visualise in RViz',
  ],
  'project-3dof-robotic-arm-cv': [
    'Write down the task and a rough "done" bar for v1',
    'Arm control — forward & inverse kinematics working',
    'CV component — detect and locate the target object',
    'Integrate — CV output drives the arm over ROS',
    'Test end-to-end (sim or hardware)',
    'Write-up — README, demo video, next steps',
  ],
  'simulation-gazebo-pybullet': [
    'Pick a base (Gazebo or PyBullet) and get it running',
    'Load a robot model (URDF) and drive it',
    'Add sensors — camera, lidar, IMU — and read the data',
    'Run your ROS + CV pipeline against the sim',
    'One scripted scenario tested start to finish',
  ],
  'cs231n-lecture-series': [
    'Lectures 1–4 — classification, loss, optimisation, backprop',
    'Lectures 5–7 — CNNs, training in practice, frameworks/hardware',
    'Lectures 8–10 — detection, segmentation, RNNs',
    'Lectures 11–13 — attention, generative models, self-supervised',
    'Skim the assignments even if you don’t submit them',
  ],
  'andrew-ng-deep-learning-specialization': [
    'Course 1 — Neural Networks and Deep Learning',
    'Course 2 — Improving Deep Neural Networks (tuning, regularisation, optimisation)',
    'Course 3 — Structuring Machine Learning Projects',
    'Course 4 — Convolutional Neural Networks',
    'Course 5 — Sequence Models',
  ],
  'slam-fundamentals': [
    'What SLAM is — the localisation + mapping loop',
    'Motion & sensor models, pose graphs',
    'Visual odometry basics',
    'Loop closure and back-end optimisation',
    'Run an existing package (ORB-SLAM / RTAB-Map) on sample data',
  ],
  '3d-vision-point-clouds': [
    'Camera calibration — intrinsics & extrinsics',
    'Stereo vision and depth from disparity',
    'Point clouds — Open3D or PCL basics',
    'Registration & ICP',
    'Small demo — RGB-D to point cloud to simple processing',
  ],
  'model-deployment-edge-optimization': [
    'Export a model to ONNX and run it',
    'Quantisation — post-training, measure the accuracy/speed trade',
    'TensorRT or TF Lite — build and benchmark an engine',
    'Deploy one model to a Pi / Jetson and measure real latency',
    'Write a repeatable deployment checklist for future projects',
  ],
  'project-multi-agent-control-room': [
    'Scope it — what the demo shows, what’s out',
    'Core simulation / environment running',
    'Multi-agent coordination logic',
    'Control-room UI / visualisation',
    'Ship v1 with a README and demo',
  ],
  'project-agent-trace-debugger': [
    'Scope it — inputs, output, the problem it solves',
    'Parse and store traces',
    'Timeline / tree visualisation',
    'Filtering, search, diffing traces',
    'Ship v1 with a README and demo',
  ],
  'project-tomato-sorting-cv-extension': [
    'Decide the CV upgrade — defect detection? ripeness grading?',
    'Collect and label a small dataset',
    'Train and evaluate the model',
    'Integrate with the existing sorting machine',
    'Document the before / after',
  ],
  'dsa-interview-prep': [
    'Arrays, strings, hashing, two pointers',
    'Linked lists, stacks, queues',
    'Trees, graphs, BFS / DFS',
    'Recursion, backtracking, dynamic programming',
    'Sorting, binary search, heaps',
    'Weekly mock — timed problems, out loud',
  ],
  'career-transition-milestones': [
    'Update the portfolio site with the new projects',
    'Rewrite CV and LinkedIn toward CV / robotics roles',
    'Build a shortlist of target companies and roles',
    'Prep answers for the common behavioural / project questions',
    'Send the first 10 applications',
  ],
};

export const roadmapSubStepsSeed: RoadmapSubStep[] = Object.entries(STEPS_BY_ITEM).flatMap(
  ([itemId, titles]) =>
    titles.map((title, i) => ({
      id: `${itemId}-step-${i + 1}`,
      itemId,
      title,
      order: i + 1,
      done: false,
      seeded: true,
    })),
);
