import {
    PRINT_ELEMENT_GAP,
    PRINT_CONTENT_HEIGHT,
    INFORMATION_ROW_HEIGHT_SMALL,
    NON_REPEATABLE_BLOCK_CONTENT_HEIGHT,
    INFORMATION_ROW_HEIGHT_LARGE,
    rowHeights,
    elementLabels,
} from './constants';

export const createPages = (blocks) => {
    let sortedBlocks = sortInputBlocks(blocks);
    const pages = getPageBlocksAccordingToBlockAndPrintContainerHeight(sortedBlocks);

    return pages;
};

const getPageBlocksAccordingToBlockAndPrintContainerHeight = (inputBlocks) => {
    const inputElements = [...inputBlocks];
    let currentPage = [],
        pages = [];
    const pageContentHeightWithBuffer = PRINT_CONTENT_HEIGHT - 20;
    let actualRemainingPrintContainerRealEstate = pageContentHeightWithBuffer;
    for (let i = 0; i < inputElements.length; i++) {
        let currentBlock = inputElements[i];

        //add Label and titles height, plus incomingRows.length * rowHeight
        const rowHeight =
            currentBlock.rowHeight === rowHeights.large ? INFORMATION_ROW_HEIGHT_LARGE : INFORMATION_ROW_HEIGHT_SMALL;
        let currentBlockHeightRowsOnly = currentBlock.rows.length * rowHeight;
        //determine height of each block
        let currentBlockHeight = currentBlockHeightRowsOnly + NON_REPEATABLE_BLOCK_CONTENT_HEIGHT + PRINT_ELEMENT_GAP;

        if (currentBlockHeight <= actualRemainingPrintContainerRealEstate) {
            //if there is a remainder, push the current block to the page chunk
            currentPage.push(currentBlock);
            actualRemainingPrintContainerRealEstate -= currentBlockHeight;
        } else if (currentBlockHeight > actualRemainingPrintContainerRealEstate) {
            if (currentBlockHeight > pageContentHeightWithBuffer) {
                //if currentblock height is larger than what the print page can fit
                const difference = currentBlockHeight - pageContentHeightWithBuffer;
                // find the difference in dimensions of overlap,
                const numberOfElementsToCreateNewBlockWith = Math.floor(difference / rowHeight);
                const indexToSliceTo = currentBlock.rows.length - numberOfElementsToCreateNewBlockWith;
                //create new input Element with overlap and spice into inputElements at i+1
                const overflowBlock = {
                    ...currentBlock,
                    label: createOverflowBlockLabel(currentBlock.label),
                    rows: currentBlock.rows.slice(indexToSliceTo),
                };
                currentBlock.rows = currentBlock.rows.slice(0, indexToSliceTo);
                //splice in newBlock at i + 1 following index
                inputElements.splice(i + 1, 0, overflowBlock);
            }
            //add current page to pages, and init a new page
            pages.push(currentPage);
            //create a new page,
            currentPage = [currentBlock];
            //initialize the remaining page real estate amount and subtract the current element height
            actualRemainingPrintContainerRealEstate = pageContentHeightWithBuffer - currentBlockHeight;
        }
    }

    pages.push(currentPage);

    return pages;
};

const sortInputBlocks = (inputBlocks) => {
    const sortInfoBlocksLeastToGreatest = (blocks) => {
        return blocks.sort((a, b) => {
            return a.rows.length - b.rows.length;
        });
    };
    const basicInfoElement = inputBlocks.filter((element) => element.label === elementLabels.basicInformation)[0];

    let sortedBlocks = basicInfoElement
        ? [basicInfoElement, ...sortInfoBlocksLeastToGreatest(inputBlocks.slice(1))]
        : sortInfoBlocksLeastToGreatest(inputBlocks);

    return sortedBlocks;
};

const createOverflowBlockLabel = (label) => {
    const continued = ' continued';
    return label.includes(continued) ? label : label + continued;
};
