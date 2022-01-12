import React, { useRef } from "react";
import { BlockLike } from "typescript";
import "./App.css";
import { ZeroSequenceIndex } from "./App.types";

function App() {
  const inputIPv6Ref = useRef<HTMLInputElement>(null);
  const inputSegmentsResultRef = useRef<HTMLInputElement>(null);
  const inputSegmentsRef = useRef<HTMLInputElement>(null);
  const inputIPv6ResultRef = useRef<HTMLInputElement>(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Glazed interview exercise</h1>
        <h2 className="authorName">Nelson Barbosa</h2>
      </header>

      <main className="App-main">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleConvertHexToIntOnclick(inputIPv6Ref, inputSegmentsResultRef);
          }}
        >
          <div className="inputLabelContainer">
            <label htmlFor="inputIPv6">
              IPv6 address input{" "}
              <span className="labelExample">(example: "2601::1:45c4")</span>:
            </label>
            <input
              id="inputIPv6"
              type="text"
              ref={inputIPv6Ref}
              className="inputText"
            ></input>
          </div>

          <button type="submit" className="button">
            Convert IPv6 address to segments!
          </button>

          <div className="inputLabelContainer">
            <label htmlFor="inputSegmentsResult">Segments result:</label>
            <input
              id="inputSegmentsResult"
              type="text"
              ref={inputSegmentsResultRef}
              disabled
              className="inputText"
            ></input>
          </div>
        </form>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleConvertSegmentsToIPv6Onclick(
              inputSegmentsRef,
              inputIPv6ResultRef
            );
          }}
        >
          <div className="inputLabelContainer">
            <label htmlFor="inputSegments">
              Segments input{" "}
              <span className="labelExample">
                (example: "[0, 0, 0, 0, 3, 0, 0, 0]")
              </span>
              :
            </label>
            <input
              id="inputSegments"
              type="text"
              ref={inputSegmentsRef}
              className="inputText"
            ></input>
          </div>

          <button type="submit" className="button">
            Convert segments to IPv6 address!
          </button>

          <div className="inputLabelContainer">
            <label htmlFor="inputIPv6Result">IPv6 address result:</label>
            <input
              id="inputIPv6Result"
              type="text"
              ref={inputIPv6ResultRef}
              disabled
              className="inputText"
            ></input>
          </div>
        </form>
      </main>
    </div>
  );
}

/**
 * Convert IPv6 address input string to corresponding array of number segments.
 * @param address IPv6 address input string in this format "2601::1:45c4".
 * @returns the corresponding segments numbers array.
 */
function toSegments(address: string): number[] {
  console.log("address: ", address);

  /**
   * Some validation.
   */
  if (!address) {
    console.log("wrong address: ", address);
    return [];
  }

  /**
   * Remove empty spaces.
   **/
  const addressClean: string = address.replace(/ /g, "");

  /**
   * Calculate number of inserted fields of IPv6 address, splitting by ':'.
   **/
  let hexSegments: string[] = addressClean.split(":");
  console.log("hex segments: ", hexSegments);

  /**
   * Know if IPv6 has the compact form "::".
   **/
  const hasCompactForm: boolean = addressClean.includes("::");
  console.log("hasCompactForm: ", hasCompactForm);

  /**
   * If true, we know that hexSegments calculated before has to be fixed.
   **/
  if (hasCompactForm === true) {
    console.log("hex segments: ", hexSegments);

    /**
     * Calculate missing fields collapsed by "::".
     * We know that with "::", hexSegments splitted before by ":" has one more length.
     **/
    const missingSegmentsNumber = 8 - (hexSegments.length - 1);

    /**
     * Replace "::" with full size 8 fields ":" of IPv6 address.
     * Example: convert "2601::1:45c4" to "2601::::::1:45c4"
     **/
    const addrCleanFullForm = addressClean.replace(
      "::",
      ":".repeat(missingSegmentsNumber + 1)
    );

    /**
     * Set hexSegments array with all full 8 fields of IPv6 address.
     **/
    hexSegments = addrCleanFullForm.split(":");
  }

  /**
   * Convert the 8 string fields of IPv6 address, to array of hexadecimal numbers.
   **/
  const intSegments = hexSegments.map((s, index) => {
    console.log("segment: ", index, s);

    /**
     * If is empty we know that value is zero.
     **/
    if (s === "") {
      return 0;
    }

    return parseInt(s, 16);
  });

  return intSegments;
}

/**
 * Convert input array of number segments to IPv6 address string.
 * Implement this rules:
 *    - compact longest string of >1 zeroes into '::';
 *    - don't use leading zeroes;
 *    - only use lowercase letters;
 * @param segments segments numbers array. Example [].
 * @returns the corresponding numbers IPv6 address string.
 */
function toString(segments: number[]): string {
  console.log("segments", segments);

  /**
   * Some validation.
   */
  if (!segments || segments.length < 1) {
    console.log("wrong segments: ", segments);
    return "";
  }

  /**
   * Problem: Compact longest string of >1 zeroes should be converted to '::'.
   * Solution: Search for all zeros sequences, and save them in array, with the startIndex and endIndex of each sequence.
   */
  const zerosSequenceIndexes: ZeroSequenceIndex[] = [];
  let currentZeroStartIndex: number | undefined = undefined;
  let currentZeroEndIndex: number | undefined = undefined;

  /**
   * Search for all zeros sequences, and save them in ipv6Addr array.
   */
  let hexNumberSegments: string[] = segments.map((sInt, index) => {
    /**
     * If 0 is found.
     */
    if (sInt === 0) {
      debugger;
      /**
       * If is the first 0, save as the current first zero index.
       */
      if (currentZeroStartIndex === undefined) {
        currentZeroStartIndex = index;
      }

      /**
       * Check if current 0 index is the last position in string.
       * If yes, save this 0 as the current last zero index.
       */
      if (index === segments.length - 1) {
        debugger;

        /**
         * Check if zero start index is different from the current last index position.
         * If is the same, it means that is this 0 sequence case: [1, 1, 1, 1, 3, 1, 1, 0]. So, it's ignored.
         * If is different, it means that is a 0 sequence case like: [1, 1, 1, 1, 3, 0, 0, 0]. So, it's allowed.
         */
        if (currentZeroStartIndex !== index) {
          /**
           * Save the current zero end index, with the previous index.
           */
          currentZeroEndIndex = index;

          zerosSequenceIndexes.push({
            startIndex: currentZeroStartIndex,
            endIndex: currentZeroEndIndex,
          });
        }

        /**
         * Reset current zero indexes;
         */
        currentZeroStartIndex = undefined;
        currentZeroEndIndex = undefined;
      }

      /**
       * Return the current number as hex string, and lower case.
       */
      return sInt.toString(16).toLowerCase();
    }

    /**
     * Here, it means that the current char isn't a zero.
     * So, check if previous zero sequence start index was found.
     * If yes, close the current zero sequence with the end index, and save it in the zero sequences array.
     */
    if (currentZeroStartIndex !== undefined) {
      /**
       * Save the current zero end index, with the previous index.
       */

      /**
       * Check if previous index (that is the last found zero sequence), is different from current start index. index is different from the current last index position.
       * If is the same, it means that is a 0 sequence case like: [1, 1, 0, 1, 3, 1, 1, 1], [0, 1, 1, 1, 3, 1, 1, 1], or [0, 1, 0, 1, 0, 1, 0, 1]. So, it's ignored.
       * If is different, it means that is a >1 length 0 sequence case like: [1, 1, 1, 1, 3, 0, 0, 0], [0, 0, 0, 1, 3, 1, 1, 1], or [0, 1, 0, 0, 0, 1, 0, 1].  So, it's allowed.
       */
      if (currentZeroStartIndex !== index - 1) {
        debugger;
        /**
         * Save the current zero end index, with the previous index.
         */
        currentZeroEndIndex = index - 1;

        zerosSequenceIndexes.push({
          startIndex: currentZeroStartIndex,
          endIndex: currentZeroEndIndex,
        });
      }

      /**
       * Reset current zero indexes;
       */
      currentZeroStartIndex = undefined;
      currentZeroEndIndex = undefined;
    }

    /**
     * Save current number as hex string, and lower case.
     */
    return sInt.toString(16).toLowerCase();
  });

  debugger;

  /**
   * Check if IPV6 address has a <1 zero sequence, to collapse it with "::".
   * If yes, the solution:
   *    Replace in the array, the zero sequence positions with one empty string:
   *       Example: convert ["1", "0", "0", "0", "3", "0", "2", "2"] to ["1", "", "3", "0", "2", "2"].
   *    Replace in the array, the zero sequence positions with ":" string, if the sequence is at start or at the end of segments array:
   *       Example: convert ["0", "0", "0", "0", "3", "0", "2", "2"] to [":", "3", "0", "2", "2"], or
   *                or convert ["3", "0", "2", "2", "0", "0", "0", "0"] to ["3", "0", "2", "2", ":"].
   *    At the end just join all that cases with ":". Examples:
   *       ["1", "", "3", "0", "2", "2"] -> "1::3:0:2:2"
   *       [":", "3", "0", "2", "2"]     -> "::3:0:2:2"
   *       ["3", "0", "2", "2", ":"]     -> "3:0:2:2::0:2:2"
   *       ["1", "", "3", "0", "2", "2"] -> "1::3:0:2:2"
   */
  if (zerosSequenceIndexes.length > 0) {
    debugger;

    /**
     * Found the longest zero sequence found.
     */
    const longestZeroSequence =
      calculateLongestZeroSequence(zerosSequenceIndexes);

    const sequenceCount: number =
      longestZeroSequence.endIndex - longestZeroSequence.startIndex + 1;

    const isSequenceAtStartOrAtEnd: boolean =
      longestZeroSequence.endIndex === hexNumberSegments.length - 1 ||
      longestZeroSequence.startIndex === 0;

    hexNumberSegments.splice(
      longestZeroSequence.startIndex,
      sequenceCount,
      isSequenceAtStartOrAtEnd ? ":" : ""
    );
  }

  return hexNumberSegments.join(":");
}

/**
 * Button event handler.
 */
function handleConvertSegmentsToIPv6Onclick(
  inputSegmentsRef: React.RefObject<HTMLInputElement>,
  inputIPv6ResultRef: React.RefObject<HTMLInputElement>
) {
  if (
    inputSegmentsRef.current === null ||
    inputIPv6ResultRef.current === null
  ) {
    return;
  }

  console.log("inputIPv6Segments string: ", inputSegmentsRef.current.value);

  const inputIPv6SegmentsString = inputSegmentsRef.current.value.replace(
    /\[| |\]/g,
    ""
  );

  if (inputIPv6SegmentsString === "0,0,0,0,0,0,0,0") {
    inputIPv6ResultRef.current.value = "0:0:0:0:0:0:0:0";
    return;
  }

  const inputIPv6Segments: number[] = inputIPv6SegmentsString
    .split(",")
    .map((s) => parseInt(s.trim(), 10));

  console.log("inputIPv6Segments: ", inputIPv6Segments);

  const ipv6AddrResult = toString(inputIPv6Segments);

  if (ipv6AddrResult !== undefined) {
    inputIPv6ResultRef.current.value = ipv6AddrResult;
  }
}

/**
 * Button event handler.
 */
function handleConvertHexToIntOnclick(
  inputIPv6Ref: React.RefObject<HTMLInputElement>,
  inputSegmentsResultRef: React.RefObject<HTMLInputElement>
) {
  if (
    inputIPv6Ref.current === null ||
    inputSegmentsResultRef.current === null
  ) {
    return;
  }

  const intSegments = toSegments(inputIPv6Ref.current.value);

  if (intSegments !== undefined) {
    inputSegmentsResultRef.current.value = `[${intSegments.join(", ")}]`;
  }
}

/**
 * Helper method to calculate the longest zero sequence in array.
 */
function calculateLongestZeroSequence(
  zerosSequenceIndexes: ZeroSequenceIndex[]
): ZeroSequenceIndex {
  return zerosSequenceIndexes.reduce(
    (prevZs, currZs) => {
      const sequenceSize = currZs.endIndex - currZs.startIndex;
      return sequenceSize > prevZs.endIndex - prevZs.startIndex
        ? currZs
        : prevZs;
    },
    {
      startIndex: 0,
      endIndex: 0,
    }
  );
}

export default App;
