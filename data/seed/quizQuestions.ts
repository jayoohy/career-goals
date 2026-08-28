import type { QuizQuestion } from '@/types/models';

/**
 * Tier 1 static quiz bank (PRD §7.1) — 5-8 MCQs per CourseSection, authored once at build
 * time. Drafted with LLM assistance per the PRD's build tip, hand-reviewed for accuracy.
 */
export const quizQuestionsSeed: QuizQuestion[] = [
  // python-prerequisites
  {
    id: 'python-prerequisites-q1',
    sectionId: 'python-prerequisites',
    prompt: 'What does the list comprehension `[x**2 for x in range(5)]` produce?',
    options: ['[0, 1, 2, 3, 4]', '[0, 1, 4, 9, 16]', '[1, 4, 9, 16, 25]', 'A syntax error'],
    correctIndex: 1,
    explanation: 'range(5) yields 0-4; squaring each gives 0, 1, 4, 9, 16.',
  },
  {
    id: 'python-prerequisites-q2',
    sectionId: 'python-prerequisites',
    prompt: 'In NumPy, what does `array.shape` return?',
    options: [
      'The data type of the array',
      'The total number of elements',
      'A tuple giving the size of the array along each dimension',
      'The memory address of the array',
    ],
    correctIndex: 2,
    explanation: '`.shape` is a tuple like (rows, cols) describing the array’s dimensions.',
  },
  {
    id: 'python-prerequisites-q3',
    sectionId: 'python-prerequisites',
    prompt: 'What is the key practical difference between a Python list and a NumPy array?',
    options: [
      'There is no real difference',
      'NumPy arrays support fast, vectorized element-wise operations; plain lists don’t',
      'Lists can only hold numbers, NumPy arrays can hold any type',
      'NumPy arrays are immutable while lists are mutable',
    ],
    correctIndex: 1,
    explanation:
      'NumPy arrays are backed by contiguous typed memory, enabling vectorized math that lists cannot do directly.',
  },
  {
    id: 'python-prerequisites-q4',
    sectionId: 'python-prerequisites',
    prompt: 'What does a function parameter defined as `*args` allow?',
    options: [
      'Passing a variable number of positional arguments',
      'Passing a variable number of keyword arguments',
      'Making every argument optional automatically',
      'Returning multiple values from the function',
    ],
    correctIndex: 0,
    explanation:
      '`*args` collects any number of positional arguments into a tuple inside the function.',
  },
  {
    id: 'python-prerequisites-q5',
    sectionId: 'python-prerequisites',
    prompt: 'What does `for i in range(3): print(i)` output?',
    options: ['1 2 3', '0 1 2', '0 1 2 3', '3 2 1'],
    correctIndex: 1,
    explanation: 'range(3) produces 0, 1, 2.',
  },

  // intro-to-deep-learning
  {
    id: 'intro-to-deep-learning-q1',
    sectionId: 'intro-to-deep-learning',
    prompt: 'What best distinguishes deep learning from traditional machine learning?',
    options: [
      'Deep learning only works on images',
      'Deep learning uses multi-layered neural networks to learn hierarchical features automatically, rather than relying on hand-engineered features',
      'Deep learning never requires any data',
      'Deep learning is a rule-based expert system',
    ],
    correctIndex: 1,
    explanation:
      'Classical ML often needs hand-crafted features; deep nets learn layered feature representations directly from data.',
  },
  {
    id: 'intro-to-deep-learning-q2',
    sectionId: 'intro-to-deep-learning',
    prompt: 'What is a "layer" in a neural network?',
    options: [
      'A single training example',
      'A group of units that transforms its input and passes the result to the next stage',
      'A type of loss function',
      'A hyperparameter controlling the learning rate',
    ],
    correctIndex: 1,
    explanation:
      'A layer applies a transformation (weights + activation) to its input before passing output onward.',
  },
  {
    id: 'intro-to-deep-learning-q3',
    sectionId: 'intro-to-deep-learning',
    prompt: 'Why has deep learning become far more practical over the last decade?',
    options: [
      'CPUs became slower, forcing simpler models',
      'Growth in available data and GPU compute made training large networks feasible',
      'Neural networks were only just invented',
      'Labeled data became unnecessary',
    ],
    correctIndex: 1,
    explanation:
      'Bigger datasets and parallel GPU compute made training deep, many-layered networks tractable.',
  },
  {
    id: 'intro-to-deep-learning-q4',
    sectionId: 'intro-to-deep-learning',
    prompt: 'What does "depth" refer to in deep learning?',
    options: [
      'The number of training epochs',
      'The number of stacked layers in the network',
      'The size of the dataset',
      'The number of GPUs used to train',
    ],
    correctIndex: 1,
    explanation: '"Deep" refers to having many stacked layers between input and output.',
  },
  {
    id: 'intro-to-deep-learning-q5',
    sectionId: 'intro-to-deep-learning',
    prompt: 'A "neuron" (unit) in a neural network is loosely analogous to:',
    options: [
      'A single training image',
      'A simple computational unit taking weighted inputs, applying an activation, and producing an output',
      'The learning rate',
      'A row in a database',
    ],
    correctIndex: 1,
    explanation:
      'A neuron computes a weighted sum of its inputs, then passes it through an activation function.',
  },

  // dl-ann-optimizers-loss-activation-cnn-theory
  {
    id: 'dl-ann-optimizers-loss-activation-cnn-theory-q1',
    sectionId: 'dl-ann-optimizers-loss-activation-cnn-theory',
    prompt: 'What does backpropagation actually compute?',
    options: [
      'The final predicted output only',
      'The gradients of the loss with respect to each weight, via the chain rule',
      'A random search over possible weight values',
      'The training dataset’s labels',
    ],
    correctIndex: 1,
    explanation:
      'Backprop applies the chain rule backward through the network to get ∂loss/∂weight for every weight.',
  },
  {
    id: 'dl-ann-optimizers-loss-activation-cnn-theory-q2',
    sectionId: 'dl-ann-optimizers-loss-activation-cnn-theory',
    prompt: 'What is the purpose of a loss function?',
    options: [
      'To measure how far the model’s predictions are from the true labels, giving a signal to optimize',
      'To store the model’s weights on disk',
      'To visualize the network architecture',
      'To normalize the input data',
    ],
    correctIndex: 0,
    explanation:
      'The loss quantifies prediction error; training minimizes it via gradient descent.',
  },
  {
    id: 'dl-ann-optimizers-loss-activation-cnn-theory-q3',
    sectionId: 'dl-ann-optimizers-loss-activation-cnn-theory',
    prompt: 'What is the core intuition behind gradient descent?',
    options: [
      'Randomly reinitializing weights until the loss happens to be low',
      'Repeatedly stepping the weights in the direction that reduces the loss fastest (the negative gradient)',
      'Picking the best of many independently pre-trained models',
      'Increasing the learning rate until the loss hits zero',
    ],
    correctIndex: 1,
    explanation:
      'Gradient descent iteratively nudges weights opposite the gradient to reduce loss.',
  },
  {
    id: 'dl-ann-optimizers-loss-activation-cnn-theory-q4',
    sectionId: 'dl-ann-optimizers-loss-activation-cnn-theory',
    prompt: 'Why are non-linear activation functions (like ReLU) necessary between layers?',
    options: [
      'They deliberately slow down training',
      'Without them, stacking layers would collapse into an equivalent single linear transformation',
      'They convert color images to grayscale',
      'They are only ever needed in the output layer',
    ],
    correctIndex: 1,
    explanation:
      'Composing linear layers with no non-linearity is still just one linear function — non-linearities let networks model complex functions.',
  },
  {
    id: 'dl-ann-optimizers-loss-activation-cnn-theory-q5',
    sectionId: 'dl-ann-optimizers-loss-activation-cnn-theory',
    prompt: 'What does an optimizer like Adam add on top of plain SGD?',
    options: [
      'Nothing — they behave identically',
      'Adaptive per-parameter learning rates using running estimates of gradient mean and variance',
      'A mathematical guarantee of finding the global minimum',
      'Removal of the need for a loss function',
    ],
    correctIndex: 1,
    explanation:
      'Adam combines momentum-like and adaptive-learning-rate ideas, often converging faster/more robustly than vanilla SGD.',
  },
  {
    id: 'dl-ann-optimizers-loss-activation-cnn-theory-q6',
    sectionId: 'dl-ann-optimizers-loss-activation-cnn-theory',
    prompt: 'In CNN theory, what does a convolutional filter/kernel do?',
    options: [
      'Randomly drops neurons during training',
      'Slides over the input to detect local patterns (like edges or textures) via a learned weighted sum',
      'Reduces the entire image to a single pixel',
      'Splits the dataset into training batches',
    ],
    correctIndex: 1,
    explanation:
      'A convolution slides a small learned filter across the input, producing a feature map that highlights where a pattern is present.',
  },

  // computer-vision-opencv
  {
    id: 'computer-vision-opencv-q1',
    sectionId: 'computer-vision-opencv',
    prompt: 'In OpenCV, what color channel order does `cv2.imread()` load an image in by default?',
    options: ['RGB', 'BGR', 'Grayscale', 'HSV'],
    correctIndex: 1,
    explanation:
      'OpenCV historically defaults to BGR channel order, which trips up a lot of people expecting RGB.',
  },
  {
    id: 'computer-vision-opencv-q2',
    sectionId: 'computer-vision-opencv',
    prompt: 'What does `cv2.Canny()` primarily perform?',
    options: ['Image resizing', 'Edge detection', 'Color space conversion', 'Face detection'],
    correctIndex: 1,
    explanation: 'Canny is a classic multi-stage edge-detection algorithm.',
  },
  {
    id: 'computer-vision-opencv-q3',
    sectionId: 'computer-vision-opencv',
    prompt: 'What is `cv2.cvtColor()` used for?',
    options: [
      'Cropping an image',
      'Converting an image between color spaces (e.g. BGR to grayscale)',
      'Drawing contours on an image',
      'Saving an image to disk',
    ],
    correctIndex: 1,
    explanation:
      '`cvtColor` converts pixel data between color spaces like BGR, RGB, grayscale, and HSV.',
  },
  {
    id: 'computer-vision-opencv-q4',
    sectionId: 'computer-vision-opencv',
    prompt: 'What does image thresholding produce?',
    options: [
      'A resized version of the image',
      'A binary (black/white) image based on a pixel-intensity cutoff',
      'A blurred version of the image',
      'A rotated version of the image',
    ],
    correctIndex: 1,
    explanation:
      'Thresholding maps each pixel to one of two values depending on whether it’s above or below a cutoff.',
  },
  {
    id: 'computer-vision-opencv-q5',
    sectionId: 'computer-vision-opencv',
    prompt: 'What is a "contour" in OpenCV terms?',
    options: [
      'A single pixel’s RGB value',
      'A curve joining continuous points along a boundary of similar intensity/color, useful for shape detection',
      'A type of neural network layer',
      'A camera calibration parameter',
    ],
    correctIndex: 1,
    explanation:
      'Contours trace object outlines and are a core tool for shape analysis in classical CV.',
  },

  // pytorch
  {
    id: 'pytorch-q1',
    sectionId: 'pytorch',
    prompt: 'What is a PyTorch `Tensor`?',
    options: [
      'A plain Python list with no GPU support',
      'A multi-dimensional array similar to a NumPy array, with GPU acceleration and autograd support',
      'A type of loss function',
      'A dataset-loading utility',
    ],
    correctIndex: 1,
    explanation:
      'Tensors are PyTorch’s core data structure — NumPy-like, but with GPU and automatic-differentiation support.',
  },
  {
    id: 'pytorch-q2',
    sectionId: 'pytorch',
    prompt: 'What does calling `.backward()` on a scalar tensor do?',
    options: [
      'Reverses the tensor’s values',
      'Computes gradients of that scalar with respect to all tensors that require grad, via autograd',
      'Undoes the previous operation',
      'Converts the tensor to a NumPy array',
    ],
    correctIndex: 1,
    explanation:
      '`.backward()` triggers autograd to populate `.grad` on every leaf tensor that requires gradients.',
  },
  {
    id: 'pytorch-q3',
    sectionId: 'pytorch',
    prompt: 'What is the role of `nn.Module` in PyTorch?',
    options: [
      'It’s the base class for building layers/models, bundling parameters and the forward pass',
      'It’s a data-augmentation utility',
      'It’s used only for loading datasets',
      'It replaces the need for a loss function',
    ],
    correctIndex: 0,
    explanation:
      'Custom models subclass `nn.Module` and define `forward()`; it tracks parameters automatically.',
  },
  {
    id: 'pytorch-q4',
    sectionId: 'pytorch',
    prompt: 'What does a `DataLoader` provide?',
    options: [
      'A way to visualize training curves',
      'Batching, shuffling, and (optionally parallel) loading of a `Dataset` during training',
      'GPU memory management',
      'Automatic hyperparameter tuning',
    ],
    correctIndex: 1,
    explanation:
      '`DataLoader` wraps a `Dataset` to yield mini-batches, optionally shuffled and loaded in parallel workers.',
  },
  {
    id: 'pytorch-q5',
    sectionId: 'pytorch',
    prompt: 'Why do you call `optimizer.zero_grad()` before each backward pass in a training loop?',
    options: [
      'To reset the model’s weights to zero',
      'Because PyTorch accumulates gradients by default, so old gradients must be cleared before computing new ones',
      'To disable autograd for that step',
      'To save a model checkpoint',
    ],
    correctIndex: 1,
    explanation:
      'Without clearing, gradients from previous steps would add to the new ones, corrupting the update.',
  },

  // deep-dive-visualizing-cnns
  {
    id: 'deep-dive-visualizing-cnns-q1',
    sectionId: 'deep-dive-visualizing-cnns',
    prompt: 'What does a "feature map" represent in a CNN?',
    options: [
      'The raw input image, unchanged',
      'The output of applying a filter across the input, showing where a learned pattern activates',
      'The final classification label',
      'The loss curve over training',
    ],
    correctIndex: 1,
    explanation:
      'Each feature map shows, spatially, how strongly one learned filter responded across the input.',
  },
  {
    id: 'deep-dive-visualizing-cnns-q2',
    sectionId: 'deep-dive-visualizing-cnns',
    prompt: 'What is the general purpose of a technique like Grad-CAM?',
    options: [
      'To compress a model for mobile deployment',
      'To highlight which regions of an input image most influenced the model’s prediction',
      'To augment the training data',
      'To normalize pixel values',
    ],
    correctIndex: 1,
    explanation:
      'Grad-CAM uses gradients flowing into a conv layer to produce a coarse heatmap of "where the model looked."',
  },
  {
    id: 'deep-dive-visualizing-cnns-q3',
    sectionId: 'deep-dive-visualizing-cnns',
    prompt: 'As you go deeper into a CNN, what typically happens to the features being detected?',
    options: [
      'They get simpler and revert to plain edges',
      'They become more abstract/high-level, combining earlier low-level features (edges → textures → parts → objects)',
      'They disappear entirely',
      'They become purely random noise',
    ],
    correctIndex: 1,
    explanation:
      'Early layers tend to learn edges/colors; deeper layers combine these into textures, parts, then whole objects.',
  },
  {
    id: 'deep-dive-visualizing-cnns-q4',
    sectionId: 'deep-dive-visualizing-cnns',
    prompt: 'What is a "receptive field" in a CNN?',
    options: [
      'The camera’s physical field of view',
      'The region of the input image that a given neuron’s activation is influenced by',
      'The size of the final output layer',
      'The learning-rate schedule',
    ],
    correctIndex: 1,
    explanation:
      'Deeper neurons have progressively larger receptive fields, since they aggregate information from wider input regions.',
  },
  {
    id: 'deep-dive-visualizing-cnns-q5',
    sectionId: 'deep-dive-visualizing-cnns',
    prompt: 'What does visualizing an individual filter’s activations help you understand?',
    options: [
      'The dataset’s file size',
      'What visual pattern (edges, colors, textures, shapes) that particular filter has learned to detect',
      'The model’s total training time',
      'The number of output classes',
    ],
    correctIndex: 1,
    explanation:
      'Filter visualization reveals the specific visual concept a given filter has become sensitive to.',
  },

  // image-classification
  {
    id: 'image-classification-q1',
    sectionId: 'image-classification',
    prompt: 'What does the softmax function do in a classifier’s output layer?',
    options: [
      'Selects the single largest pixel value in the image',
      'Converts raw scores (logits) into a probability distribution over classes that sums to 1',
      'Removes outliers from the dataset',
      'Normalizes the input image’s brightness',
    ],
    correctIndex: 1,
    explanation:
      'Softmax exponentiates and normalizes logits so they form a valid probability distribution across classes.',
  },
  {
    id: 'image-classification-q2',
    sectionId: 'image-classification',
    prompt: 'Why is cross-entropy loss commonly used for classification?',
    options: [
      'It directly measures pixel-wise similarity between images',
      'It strongly penalizes confident wrong predictions and aligns well with optimizing predicted class probabilities',
      'It only works for regression tasks',
      'It doesn’t require any labels',
    ],
    correctIndex: 1,
    explanation:
      'Cross-entropy compares the predicted probability distribution to the true (one-hot) label distribution.',
  },
  {
    id: 'image-classification-q3',
    sectionId: 'image-classification',
    prompt: 'What is transfer learning?',
    options: [
      'Training a model completely from scratch every time',
      'Reusing a model pretrained on one (often large) dataset as a starting point for a related task',
      'Moving a trained model between GPUs',
      'Transferring data between two databases',
    ],
    correctIndex: 1,
    explanation:
      'Transfer learning fine-tunes pretrained weights instead of learning everything from random initialization.',
  },
  {
    id: 'image-classification-q4',
    sectionId: 'image-classification',
    prompt: 'What does "overfitting" mean?',
    options: [
      'The model performs well on training data but poorly on unseen/validation data because it memorized noise',
      'The model is too simple to learn anything useful',
      'The model trains too slowly',
      'The dataset is too large to fit in memory',
    ],
    correctIndex: 0,
    explanation:
      'Overfitting means the model fit the training set’s quirks rather than the general pattern.',
  },
  {
    id: 'image-classification-q5',
    sectionId: 'image-classification',
    prompt: 'What is "top-1 accuracy"?',
    options: [
      'The percentage of predictions where the single highest-probability class matches the true label',
      'The accuracy measured after only the first training epoch',
      'The number of classes in the dataset',
      'The loss value after a single batch',
    ],
    correctIndex: 0,
    explanation: 'Top-1 accuracy checks only whether the model’s single best guess is correct.',
  },

  // data-augmentation
  {
    id: 'data-augmentation-q1',
    sectionId: 'data-augmentation',
    prompt: 'What is the main purpose of data augmentation?',
    options: [
      'To make the dataset physically larger on disk',
      'To artificially increase the diversity of training data (flips, rotations, crops, etc.) and reduce overfitting',
      'To remove mislabeled examples automatically',
      'To speed up inference at deployment time',
    ],
    correctIndex: 1,
    explanation:
      'Augmentation exposes the model to more variation of the same underlying examples, improving generalization.',
  },
  {
    id: 'data-augmentation-q2',
    sectionId: 'data-augmentation',
    prompt: 'Which of these is a typical image augmentation technique?',
    options: [
      'Random horizontal flip',
      'Deleting the loss function',
      'Changing the model’s architecture',
      'Removing the optimizer',
    ],
    correctIndex: 0,
    explanation:
      'Flips, rotations, crops, color jitter, and similar pixel-level transforms are standard augmentations.',
  },
  {
    id: 'data-augmentation-q3',
    sectionId: 'data-augmentation',
    prompt:
      'Should the validation/test set typically be augmented the same way as the training set?',
    options: [
      'Yes, always identically',
      'No — augmentation is applied to training data to improve generalization; validation/test data should reflect real, unaltered inputs',
      'It never matters either way',
      'Only if the model is currently overfitting',
    ],
    correctIndex: 1,
    explanation:
      'You want evaluation to reflect real-world inputs, so augmentation is normally training-only.',
  },
  {
    id: 'data-augmentation-q4',
    sectionId: 'data-augmentation',
    prompt: 'If a model still overfits despite augmentation, what else might help alongside it?',
    options: [
      'Removing more of the training data',
      'Techniques like dropout, weight decay/regularization, or gathering more real data',
      'Increasing the learning rate to its maximum',
      'Turning off validation entirely',
    ],
    correctIndex: 1,
    explanation:
      'Augmentation is one regularization tool among several — dropout, weight decay, and more data also help.',
  },
  {
    id: 'data-augmentation-q5',
    sectionId: 'data-augmentation',
    prompt:
      'Does data augmentation change the underlying label of an image (e.g. a flipped photo of a cat)?',
    options: [
      'Yes, the label always changes with the pixels',
      'No — the label should stay the same; augmentation only changes pixels in ways that preserve the original class',
      'It depends on the image file format',
      'Augmentation removes the label entirely',
    ],
    correctIndex: 1,
    explanation:
      'A well-chosen augmentation (like a horizontal flip of a cat) shouldn’t change what class the image belongs to.',
  },

  // basics-of-object-detection
  {
    id: 'basics-of-object-detection-q1',
    sectionId: 'basics-of-object-detection',
    prompt: 'How does object detection differ from image classification?',
    options: [
      'They are exactly the same task',
      'Object detection both localizes (bounding boxes) and classifies multiple objects in an image, not just a single whole-image label',
      'Classification is inherently harder than detection',
      'Detection doesn’t use neural networks',
    ],
    correctIndex: 1,
    explanation:
      'Detection outputs a variable number of (box, class) pairs, rather than one label for the entire image.',
  },
  {
    id: 'basics-of-object-detection-q2',
    sectionId: 'basics-of-object-detection',
    prompt: 'What does IoU (Intersection over Union) measure?',
    options: [
      'The training speed of a model',
      'The overlap between a predicted bounding box and the ground-truth box, used to judge localization accuracy',
      'The number of object classes in the dataset',
      'The resolution of the input image',
    ],
    correctIndex: 1,
    explanation:
      'IoU = overlap area ÷ union area of the two boxes; higher means a better-localized prediction.',
  },
  {
    id: 'basics-of-object-detection-q3',
    sectionId: 'basics-of-object-detection',
    prompt: 'What is the purpose of anchor boxes in many detection architectures?',
    options: [
      'To store the model’s final predictions',
      'Predefined boxes of various scales/aspect ratios that the model adjusts, to detect objects of different shapes and sizes',
      'To crop the input image before training',
      'To normalize pixel intensities',
    ],
    correctIndex: 1,
    explanation:
      'Anchors give the model a set of reference shapes to refine, rather than predicting boxes from scratch.',
  },
  {
    id: 'basics-of-object-detection-q4',
    sectionId: 'basics-of-object-detection',
    prompt: 'What does mAP (mean Average Precision) evaluate?',
    options: [
      'The average pixel brightness of the dataset',
      'Detection performance across classes and confidence thresholds, combining precision and recall',
      'The model’s memory usage',
      'The strength of the data augmentation used',
    ],
    correctIndex: 1,
    explanation:
      'mAP averages per-class average precision, making it the standard summary metric for detectors.',
  },
  {
    id: 'basics-of-object-detection-q5',
    sectionId: 'basics-of-object-detection',
    prompt: 'Why is object detection generally harder than image classification?',
    options: [
      'It isn’t actually harder',
      'It requires predicting a variable number of objects, each with both a location and a class, instead of one label for the whole image',
      'Detection models don’t use CNNs at all',
      'Classification always requires more training data',
    ],
    correctIndex: 1,
    explanation:
      'Detection combines localization and classification for an unknown number of objects per image.',
  },

  // image-segmentation
  {
    id: 'image-segmentation-q1',
    sectionId: 'image-segmentation',
    prompt: 'What is the key difference between semantic and instance segmentation?',
    options: [
      'There is no real difference',
      'Semantic segmentation labels every pixel by class without distinguishing individual objects; instance segmentation also separates distinct object instances of the same class',
      'Instance segmentation only works on grayscale images',
      'Semantic segmentation doesn’t use neural networks',
    ],
    correctIndex: 1,
    explanation:
      'Semantic segmentation would label all "person" pixels the same; instance segmentation tells person #1 from person #2.',
  },
  {
    id: 'image-segmentation-q2',
    sectionId: 'image-segmentation',
    prompt: 'What does image segmentation produce, compared to object detection’s bounding boxes?',
    options: [
      'A single class label for the whole image',
      'A pixel-level mask assigning a class to every pixel',
      'A confidence score only, with no spatial information',
      'A cropped thumbnail of the object',
    ],
    correctIndex: 1,
    explanation: 'Segmentation gives dense, per-pixel predictions rather than a coarse rectangle.',
  },
  {
    id: 'image-segmentation-q3',
    sectionId: 'image-segmentation',
    prompt: 'What is U-Net, at a high level?',
    options: [
      'A GPU hardware brand',
      'An encoder-decoder CNN architecture with skip connections, widely used for segmentation tasks',
      'A data augmentation library',
      'An object detection evaluation metric',
    ],
    correctIndex: 1,
    explanation:
      'U-Net’s downsampling encoder + upsampling decoder, linked by skip connections, is a segmentation staple.',
  },
  {
    id: 'image-segmentation-q4',
    sectionId: 'image-segmentation',
    prompt: 'What kind of loss is commonly used to train a per-pixel segmentation model?',
    options: [
      'A per-pixel loss like cross-entropy or Dice loss, applied across the predicted vs. ground-truth mask',
      'A single scalar comparing only image file sizes',
      'No loss is needed for segmentation',
      'A loss that ignores pixel location entirely',
    ],
    correctIndex: 0,
    explanation:
      'Segmentation losses are computed pixel-by-pixel (or region-overlap-based, like Dice/IoU loss) across the mask.',
  },
  {
    id: 'image-segmentation-q5',
    sectionId: 'image-segmentation',
    prompt:
      'What real-world CV task especially benefits from segmentation over plain classification?',
    options: [
      'Determining an object’s precise shape/extent — e.g. a tumor’s exact boundary in a medical scan, or the drivable road area for a self-driving car',
      'Only telling you whether a cat is present anywhere in the photo',
      'Naming the image file',
      'Compressing the image for storage',
    ],
    correctIndex: 0,
    explanation:
      'Segmentation is valuable exactly when you need pixel-precise boundaries, not just a whole-image label.',
  },

  // project-001-yolo-image-search-app
  {
    id: 'project-001-yolo-image-search-app-q1',
    sectionId: 'project-001-yolo-image-search-app',
    prompt: 'What does "YOLO" stand for, and what’s its core idea?',
    options: [
      '"You Only Look Once" — it frames detection as a single pass over a grid, predicting boxes and classes in one forward pass',
      'A slow, two-stage detector requiring a separate region-proposal step',
      'An image-compression algorithm',
      'A segmentation-only architecture',
    ],
    correctIndex: 0,
    explanation:
      'YOLO’s single-shot design is what makes it fast enough for near-real-time detection.',
  },
  {
    id: 'project-001-yolo-image-search-app-q2',
    sectionId: 'project-001-yolo-image-search-app',
    prompt: 'What is the role of Non-Max Suppression (NMS) in a detector like YOLO?',
    options: [
      'To increase the number of overlapping boxes kept',
      'To remove duplicate/overlapping bounding-box predictions for the same object, keeping only the highest-confidence one',
      'To resize the input image before inference',
      'To train the model faster',
    ],
    correctIndex: 1,
    explanation:
      'Without NMS, a detector would often report the same object multiple times with slightly different boxes.',
  },
  {
    id: 'project-001-yolo-image-search-app-q3',
    sectionId: 'project-001-yolo-image-search-app',
    prompt: 'In an image-search application, what is typically compared to find similar images?',
    options: [
      'Raw pixel values only',
      'Embedding vectors (feature representations) extracted from a trained model, compared via a similarity metric like cosine distance',
      'The images’ file names',
      'The images’ file sizes',
    ],
    correctIndex: 1,
    explanation:
      'Deep feature embeddings capture visual/semantic similarity far better than raw pixels or metadata.',
  },
  {
    id: 'project-001-yolo-image-search-app-q4',
    sectionId: 'project-001-yolo-image-search-app',
    prompt: 'Why might a YOLO-powered search app apply a confidence threshold to detections?',
    options: [
      'To discard low-confidence detections that are likely false positives, keeping only reliable results',
      'To intentionally slow down inference',
      'To increase the number of output classes',
      'To disable NMS',
    ],
    correctIndex: 0,
    explanation:
      'A confidence cutoff filters out weak, unreliable detections before they reach the user.',
  },
  {
    id: 'project-001-yolo-image-search-app-q5',
    sectionId: 'project-001-yolo-image-search-app',
    prompt: 'What does a detector’s "confidence score" typically represent?',
    options: [
      'The model’s estimate of both objectness (is there an object here) and how correct the predicted box/class is',
      'The learning rate used during training',
      'The number of training epochs completed',
      'The file size of the input image',
    ],
    correctIndex: 0,
    explanation:
      'Confidence combines "is something here" with "how sure am I about the box and class."',
  },
];
