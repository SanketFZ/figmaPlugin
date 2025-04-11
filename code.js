figma.showUI(__html__, { width: 360, height: 480 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'analyze-image') {
    const selections = figma.currentPage.selection;
    if (selections.length === 0) {
      figma.ui.postMessage({ error: 'No image selected.' });
      return;
    }

    const imageDataArray = [];

    for (const node of selections) {
      if ("fills" in node && node.fills && node.fills[0].type === "IMAGE") {
        const imageHash = node.fills[0].imageHash;
        const image = figma.getImageByHash(imageHash);
        const bytes = await image.getBytesAsync();
        imageDataArray.push({
          name : node.name,
          imageBytes: bytes,
          width: node.width,
          height: node.height
        });
      }
    }

    if (imageDataArray.length === 0) {
      figma.ui.postMessage({ error: 'No valid image nodes found.' });
      return;
    }

    figma.ui.postMessage({ images: imageDataArray });
  }
};
