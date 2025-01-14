    export const vec2 = (x,y) => {
        const result = new Float32Array([x,y]);
        result.rows = 2;
        result.cols = 1;
        return result;
    };

    export const vec3 = (x,y,z) => {
        const result = new Float32Array([x,y,z]);
        result.rows = 3;
        result.cols = 1;
        return result;
    };

    export const makeVec3 = (data) => {
        if ( data && data.length > 3 ) {
            return vec3(data[0],data[1],data[2]);
        }
        return vec3(0,0,0);
    };


    export const vec4 = (x,y,z,w) => {
        const result = new Float32Array([x,y,z,w]);
        result.rows = 4;
        result.cols = 1;
        return result;
    };

    export const mat3 = ( data ) => {
        if ( !data || data.length < 9 )
            return undefined;
        let dCols = data.cols;
        let dRows = data.rows;
        if ( dCols < 3 || dRows < 3 )
            return undefined;
        
        const result = new Float32Array(9);
        result.rows = 3;
        result.cols = 3;

        for ( let i = 0; i < 3; i++ ) {
            let idx = i*3;
            let dataIdx = i*dCols;
            for ( let j = 0; j < 3; j++ ) {
                result[idx+j] = data[dataIdx+j];
            }
        }
        return result;
    };

    /**
     * 
     * @param {Float32Array} v1 
     * @param {Float32Array} v2 
     */
    export const makeDotProductVectors = (v1,v2) => {
		if ( !v1 || !v2 ) {
			return;
		}
        const len = v1.length;
        if ( !len || len < 1 || v2.length != len ) {
            return;
        }
        let result = 0.0;
        for ( let i = 0; i < len; i++ ) {
            result += v1[i]*v2[i];
        }
        return result;
    };


    const isValidArrayValues = ( v1 ) => {
        if ( !v1 || !v1.length  )
            return false;
        return true;
    };

    /**
     * 2차원 배열이라도( Matrix ) Typed Array 로 사용될 경우 1차원 형식으로 구성
     * 그렇기 때문에 1차원 배열로 간주함
     * @param {*} mat 
     * @param {*} roundValue 
     * @param {*} needClone 
     * @returns 
     */
    export const makeRoundValues = ( mat, roundValue, needClone ) => {
        if ( !isValidArrayValues(mat)) {
            return mat;
        }

        if ( !roundValue || roundValue < 0 ) {
            roundValue = 100000; // javascript 에서 부동 소수점 연산 오류를 피하기 위한 값
        }

        const len = mat.length;
        let result = mat;
        if ( needClone ) {
            result = new Float32Array(len);
            if ( mat.rows ) {
                result.rows = mat.rows;
            }
            if ( mat.cols ) {
                result.cols = mat.cols;
            }
        }
        for ( let i = 0; i < len; i++ ) {
            result[i] = Math.round(mat[i]*roundValue)/roundValue;
        }
        return result;
    };

    /**
     * 백터의 길이를 계산하기 위한 함수
     * @param {*} v1 
     * @returns 
     */
    export const getVectorLength = ( v1 ) => {
        if ( !isValidArrayValues(v1)  )
            return undefined;
        
        let sum = 0.0;
        for ( let i = 0; i < v1.length; i++ ) {
            sum += (v1[i]*v1[i]);
        }
        return Math.sqrt(sum);
    };

    /**
     * Normalize 하기 위한 함수
     * @param {*} v1 
     * @param {*} needRound 
     * @returns 
     */
    export const makeNormalizeVector = ( v1, needRound ) => {
        if ( !isValidArrayValues(v1)  )
            return undefined;

        const len = v1.length;
        const result = new Float32Array(len);

        const lv = getVectorLength(v1);
        if ( lv == 0 ) {
            return result;
        }
        if ( needRound ) {
            for ( let i = 0; i < len; i++ ) {
                result[i] = makeRoundValues(v1[i]/lv);
            }
        } else {
            for ( let i = 0; i < len; i++ ) {
                result[i] = v1[i]/lv;
            }
        }
        return result;       
    };

    const validateVectorLength = (v1, v2) => {
        if ( !isValidArrayValues(v1) ) 
            return -1;
        if ( !isValidArrayValues(v2) ) 
            return -1;
        let len = v1.length;
        if ( len != v2.length )
            return -1;
        return len; 
    };

    /**
     * 노출되지 않고 계산하는 함수
     * @param {*} v1 
     * @param {*} v2 
     * @param {*} calcType : 1은 더하기, 2는 빼기 -- 1이 아니면 무조건 빼기로 구성
     * @returns 
     */
    const makeVectorPlusMinus = (v1, v2, calcType, isAccelation ) => {
        let len = validateVectorLength(v1,v2);
        if ( len <= 0 )
            return undefined;

        const result = isAccelation ? v1 : new Float32Array(len);
        result.rows = v1.rows;
        result.cols = v1.cols;
        for ( let i = 0; i < len; i++ ) {
            if ( calcType == 1 ) {  // vector plus
                result[i] = v1[i] + v2[i];
            } else {    //  default vector minus 
                result[i] = v1[i] - v2[i];
            }
        }
        return result;
    };

    /**
     * 
     * @param {*} v1 
     * @param {*} v2 
     * @returns 
     */
    export const makeVectorPlusValues = (v1,v2) => {
        return makeVectorPlusMinus(v1,v2, 1);
    };

    /**
     * 
     * @param {*} v1 
     * @param {*} v2 
     * @returns 
     */
    export const makeVectorMinusValues = (v1,v2) => {
        return makeVectorPlusMinus(v1,v2, 2);
    };

    export const makeVectorAccelationPlusValues = (v1,v2) => {
        return makeVectorPlusMinus(v1,v2, 1,true);
    };

    export const makeVectorAccelationMinusValues = (v1,v2) => {
        return makeVectorPlusMinus(v1,v2, 2,true);
    };


    const makeVectorMuliply = (v1,v2,calcType, isAccelation) => {
        let len = validateVectorLength(v1,v2);
        if ( len <= 0 )
            return undefined;

        const result = isAccelation ? v1 : new Float32Array(len);
        result.rows = v1.rows;
        result.cols = v1.cols;
    
        for ( let i = 0; i < len; i++ ) {
            if ( calcType == 1 ) {  // vector muliply
                result[i] = v1[i] * v2[i];
            } else {    //  default vector divide 
                result[i] = v1[i]/v2[i];
            }
        }
        return result;
    };

    const makeVectorMuliplyScala = (v1,scalarValue,calcType,isAccelation) => {
        if ( !isValidArrayValues(v1) || !scalarValue )
            return undefined;

        let len = v1.length;

        const result = isAccelation ? v1 : new Float32Array(len);
        result.rows = v1.rows;
        result.cols = v1.cols;
        for ( let i = 0; i < len; i++ ) {
            if ( calcType == 1 ) {  // vector muliply
                result[i] = v1[i] * scalarValue;
            } else {    //  default vector divide 
                result[i] = v1[i]/scalarValue;
            }
        }
        return result;
    };

    export const makeVectorMultiplyValues = (v1,v2) => {
        return makeVectorMuliply(v1,v2,1);
    };
    export const makeVectorDivideValues = (v1,v2) => {
        return makeVectorMuliply(v1,v2,2);
    };
    export const makeVectorMultiplyScalarValues = (v1,scalarValue) => {
        return makeVectorMuliplyScala(v1,scalarValue,1);
    };
    export const makeVectorDivideScalarValues = (v1,scalarValue) => {
        return makeVectorMuliplyScala(v1,scalarValue,2);
    };

    export const makeVectorAccelationMultiplyValues = (v1,v2) => {
        return makeVectorMuliply(v1,v2,1,true);
    };
    export const makeVectorAccelationDivideValues = (v1,v2) => {
        return makeVectorMuliply(v1,v2,2,true);
    };
    export const makeVectorAccelationMultiplyScalarValues = (v1,scalarValue) => {
        return makeVectorMuliplyScala(v1,scalarValue,1,true);
    };
    export const makeVectorAccelationDivideScalarValues = (v1,scalarValue) => {
        return makeVectorMuliplyScala(v1,scalarValue,2,true);
    };

    /**
     * Vector Inner Product , Dot Product Value
     * @param {*} v1 
     * @param {*} v2 
     * @returns : scalar value 
     */
    export const makeVectorDotProductValues = (v1,v2) => {
        let len = validateVectorLength(v1,v2);
        if ( len <= 0 )
            return undefined;

        let result = 0.0;
        for ( let i = 0; i < len; i++ ) {
            result += (v1[i]*v2[i]);
        }
        return result;
    };

    /**
     * 두 백터의 Dot Product 결과를 통해 cosine theta 값을 가져오기 위한 함수
     * @param {*} v1 
     * @param {*} v2 
     * @returns : cosine theta 값
     */
    export const getCosineValue = (v1,v2) => {
        let len = validateVectorLength(v1,v2);
        if ( len <= 0 )
            return undefined;
        const v1Len = getVectorLength(v1);
        const v2Len = getVectorLength(v2);
        const dotValue = makeVectorDotProductValues(v1,v2);

        return dotValue/(v1Len*v2Len);
    };

    /**
     * Vector Cross Product 
     * @param {*} v1 
     * @param {*} v2 
     * @returns Vector 
     */
    export const makeVectorCrossProductValues = (v1,v2) => {
        let len = validateVectorLength(v1,v2);
        if ( len != 3 )
            return undefined;

        const result = new Float32Array(len);
        result[0] = ( v1[1]*v2[2] - v1[2]*v2[1]);
        result[1] = ( v1[2]*v2[0] - v1[0]*v2[2]);
        result[2] = ( v1[0]*v2[1] - v1[1]*v2[0]);        
        return result;
    };

    /**
     * Cross Product 값을 이용하여 sin theta 값을 가져오기 위한 함수
     * @param {*} v1 
     * @param {*} v2 
     * @returns 
     */
    export const getSinValue = (v1, v2) => {
        let len = validateVectorLength(v1,v2);
        if ( len != 3 )
            return undefined;
        const v1Len = getVectorLength(v1);
        const v2Len = getVectorLength(v2);
        const crossValue = getVectorLength(makeVectorCrossProductValues(v1,v2));

        return crossValue/(v1Len*v2Len);
    };


	export const makeTriangleNormals = (stdVector, firstVector, secondVector) => {
		if ( !stdVector || !firstVector || !secondVector ) {
			return;
		}

		let v1 = makeVectorMinusValues(firstVector, stdVector);
		let v2 = makeVectorMinusValues(secondVector, stdVector);

		let result = makeVectorCrossProductValues(v1, v2);
		return  makeNormalizeVector(result,true);
	}


	const cot = (v) => {
		return 1.0/Math.tan(v);
	}

	export const makeOrthographicMatrix = (left, right, bottom, top, near, far ) => {
		let scaleX = 2.0/(right-left);
		let scaleY = 2.0/(top-bottom);
		let scaleZ = -2.0/(far-near);
		let midX = (left+right)/(left-right);
		let midY = (bottom+top)/(bottom-top);
		let midZ = (near+far)/(near-far);
		const result = new Float32Array([
			 scaleX, 0, 0, midX,
			 0,scaleY,0,midY,
			 0,0, scaleZ, midZ,
			 0,0,0,1
		]);
        result.rows = 4;
        result.cols = 4;

        return result;
	}

	export const makePerspectiveMatrix = ( fovy, aspect, near, far ) => {
		let cv = cot(fovy/2);
		var nf = 1 / (near - far);
		
		const result = new Float32Array([
			cv/aspect, 0, 0, 0,
			0, cv, 0,0,
			0, 0, -((far+near)/(far-near)), -(2*near*far/(far-near)), 
			0, 0, -1, 0
		]);
        result.rows = 4;
        result.cols = 4;
        return result;
	}

    export const makeIdentityMatrix = (m) => {
        const result = new Float32Array(m*m);
        result.rows = m;
        result.cols = m;

        for ( let i = 0; i < m; i++ ) {
            result[i*m+i] = 1;
        }
        return result;
    };

    export const multiplyMatrix = (m1,m2) => {
        if ( !m1 || !m2 ) 
            return undefined;   //  계산 할 수 없음 
        
        if (!m1.cols || !m2.rows || m1.cols != m2.rows ) 
            return undefined;
        
        const row1 = m1.rows;
        const col1 = m1.cols;
        const col2 = m2.cols;
        const result = new Float32Array(row1*col2);
        result.rows = row1;
        result.cols = col2;

        for ( let r = 0; r < row1; r++ ) {
            for ( let c = 0; c < col2; c++ ) {
                let idx = r*col2+c;
                for ( let t = 0; t < col1; t++ ) {
                    let idx01 = r*col1+t;
                    let idx02 = t*col2+c;
                    result[idx] += m1[idx01]*m2[idx02];
                }
            }
        }
        return result;
    };

    export const makeTransposeMatrix = ( matrix ) => {
		if ( !matrix ) {
			alert( "NO DATA" );
			return;
		}

        const rows = matrix.rows;
        if ( !rows )    //  내부에서 사용하는 형식이 아님
            return;
        const cols = matrix.cols;
        if ( !cols )    //  내부에서 사용하는 형식이 아님
            return;

        const result = new Float32Array(matrix.length);
        result.rows = cols;
        result.cols = rows;

        for ( let i = 0; i < cols; i++ ) {
            for ( let j = 0; j < rows; j++ ) {
                let idx = i*rows+j;
                let idx01 = j*cols+i;
                result[idx] = matrix[idx01];
            }
        }

		return result;
	};

    export const copyMatrixValues = (matrix) => {
        if ( !matrix ) {
			alert( "NO DATA" );
			return;
		}

        const rows = matrix.rows;
        if ( !rows )    //  내부에서 사용하는 형식이 아님
            return;
        const cols = matrix.cols;
        if ( !cols )    //  내부에서 사용하는 형식이 아님
            return;

        const result = new Float32Array(matrix.length);
        result.rows = rows;
        result.cols = cols;
        for ( let i = 0 , iSize = matrix.length; i < iSize; i++ ) {
            result[i] = matrix[i];
        }
        return result;
    };

	const switchRowPositionValues = (orgMat, colSize, curRowIdx, transRowIdx) => {
		if ( !orgMat || curRowIdx == transRowIdx || curRowIdx < 0 )
			return;
		const curIdx = curRowIdx*colSize;
		const trIdx = transRowIdx*colSize;
		for ( let i = 0; i < colSize; i++ ) {
			let v = orgMat[trIdx+i];
			orgMat[trIdx+i] = orgMat[curIdx+i];
			orgMat[curIdx+i] = v;
		}
	};


    export const makeInverseMatrix = ( matrix ) => {
		if ( !matrix ) {
			return;
		}
        const orgLen = matrix.length;
        if ( !orgLen ) 
            return;

        let rows = -1;
        let cols = -1;

        if ( matrix.rows && matrix.cols ) {
            rows = matrix.rows;
            cols = matrix.cols;
        } else {
            rows = Math.sqrt(orgLen);
            cols = rows;
        }

		if ( rows*rows != orgLen ) {
			return;
		}

		const inverseV = makeIdentityMatrix(rows);
		const orgV = copyMatrixValues(matrix);
		for ( let r = 0; r < rows; r++ ) {
			let stIdx = r*cols+r;
			while ( orgV[stIdx] == 0 ) {
				let canCalc = false;
				for ( let t = r+1; t < rows; t++ ) {
					switchRowPositionValues(orgV, cols, r, t);
                    switchRowPositionValues(inverseV, cols, r, t);                    

					if ( orgV[stIdx] != 0 ) {
						canCalc = true;
						break;
					}
				}
				if ( !canCalc ) {
					return;
				}
			}
			let sv = orgV[stIdx];
			let sIdx = r*cols;
			for ( let c = 0; c < cols; c++ ) {
				orgV[sIdx+c] /= sv;
				inverseV[sIdx+c] /= sv;
			}
			for ( let t = r+1; t < rows; t++ ) {
				let tIdx = t*cols;
				sv = orgV[tIdx+r];
				for ( let c = 0; c < cols; c++ ) {
					orgV[tIdx+c] -= (sv*orgV[sIdx+c]);
					inverseV[tIdx+c] -= (sv*inverseV[sIdx+c]);;
				}
			}
		}

		for ( let r = rows-1; r > 0; r-- ) {
			let sIdx = r*cols;
			for ( let t = r-1; t >= 0; t-- ) {
				let tIdx = t*cols;
				let sv = orgV[tIdx+r];

				for ( let c = 0; c < cols; c++ ) {
					orgV[tIdx+c] -= ( sv * orgV[sIdx+c]);
					inverseV[tIdx+c] -= (sv*inverseV[sIdx+c]);
				}
			}
		}
		return inverseV;
	};

    const makeCubicMatirx = (dataArray) => {

        if ( !dataArray )
            return;
        const len       = dataArray.length-1;
        const fullLen   = len*4;
        const matrix    = new Float32Array(fullLen*fullLen);
        const rValue    = new Float32Array(fullLen);

        for ( let r = 0; r < fullLen; r++ ) {
            let idx = r*fullLen;
            let sIdx = Math.floor(r/2);
            let eIdx = Math.ceil(r/2);
            let flag = (sIdx == eIdx);
            let start = sIdx*4;

            let secondIndex = r-len*2;
            let sStart = secondIndex * 4;
            let thirdIndex = r-len*3+1;
            let tStart  = thirdIndex * 4;

            for ( let c = 0; c < fullLen; c++ ) {
                let cv = 0;
                let curIdx = sIdx;
                if ( !flag ) {
                    curIdx = eIdx;
                }
                
                if ( sIdx < len ) {
                    if ( c == 0 )
                        rValue[r] = dataArray[curIdx].y;

                    if ( c == start ) {
                        cv = (dataArray[curIdx].x * dataArray[curIdx].x * dataArray[curIdx].x) ;
                    } else if ( c == (start+1) ) {
                        cv = (dataArray[curIdx].x * dataArray[curIdx].x) ;
                    } else if ( c == (start+2) ) {
                        cv = dataArray[curIdx].x;
                    } else if ( c == (start+3)) {
                        cv = 1;
                    }
                } else if ( secondIndex < len-1 ) {
                    if ( c == sStart ) {
                        cv =  3* (dataArray[secondIndex+1].x * dataArray[secondIndex+1].x) ;
                    } else if ( c == (sStart+1)) {
                        cv = 2 * dataArray[secondIndex+1].x;
                    } else if ( c == (sStart+2)) {
                        cv = 1;
                    } else if ( c == (sStart+4)) {
                        cv =  -3* (dataArray[secondIndex+1].x * dataArray[secondIndex+1].x) ;
                    } else if ( c == (sStart+5)) {
                        cv = -2 * dataArray[secondIndex+1].x;
                    } else if ( c == (sStart+6)) {
                        cv = -1;
                    }
                } else if ( thirdIndex < len-1 ) {
                    if ( c == tStart ) {
                        cv =  6 * (dataArray[thirdIndex+1].x) ;
                    } else if ( c == (tStart+1)) {
                        cv = 2 ;
                    } else if ( c == (tStart+4)) {
                        cv =  -6 * (dataArray[thirdIndex+1].x) ;
                    } else if ( c == (tStart+5)) {
                        cv = -2;
                    } 
                } else if ( r == fullLen-2 ) {
                    if ( c == 0 ) {
                        cv =  6 * (dataArray[0].x) ;
                    } else if ( c == 1 ) {
                        cv = 2;
                    }
                } else {
                    if ( c == fullLen-4 ) {
                        cv =  6 * (dataArray[len].x) ;
                    } else if ( c == fullLen-3 ) {
                        cv = 2;
                    }
                }
                matrix[idx+c] = cv;
            }
        }
        matrix.rows = fullLen;
        matrix.cols = fullLen;
        rValue.rows = fullLen;
        rValue.cols = 1;

        return {
            "matrix" : matrix, 
            "rValue" : rValue,
        }
    };

    const makeQuadraticMatrix = (dataArray) => {
        if ( !dataArray )
            return;
        const len       = dataArray.length-1;
        const fullLen   = len*3;
        const matrix    = new Float32Array(fullLen*fullLen);
        const rValue        = new Float32Array(fullLen);
        for ( let r = 0; r < fullLen; r++ ) {
            let idx = r*fullLen;
            let sIdx = Math.floor(r/2);
            let eIdx = Math.ceil(r/2);
            let flag = (sIdx == eIdx);
            let start = sIdx*3;
            for ( let c = 0; c < fullLen; c++ ) {
                let cv = 0;
                let curIdx = sIdx;
                if ( !flag ) {
                    curIdx = eIdx;
                }
                
                if ( sIdx < len ) {
                    if ( c == 0 )
                        rValue[r] = dataArray[curIdx].y;

                    if ( c == start ) {
                        cv = (dataArray[curIdx].x * dataArray[curIdx].x) ;
                    } else if ( c == (start+1) ) {
                        cv = dataArray[curIdx].x;
                    } else if ( c == (start+2)) {
                        cv = 1;
                    }
                } else {
                    let pIdx = (r-len*2);
                    let stIdx = pIdx*3;

                    if ( pIdx == (len-1)) {
                        if (c == 0 ) {
                            cv = 1;
                        }
                    } else {
                        if ( c == stIdx ) {
                            cv = (2*dataArray[pIdx+1].x);
                        } else if ( c == (stIdx+1 )) {
                            cv = 1;
                        } else if ( c == (stIdx+3 )) {
                            cv = -(2*dataArray[pIdx+1].x);
                        } else if ( c == (stIdx+4)) {
                            cv = -1;
                        }
                    }
                }
                matrix[idx+c] = cv;
            }
        }
        matrix.rows = fullLen;
        matrix.cols = fullLen;
        rValue.rows = fullLen;
        rValue.cols = 1;

        return {
            "matrix" : matrix, 
            "rValue" : rValue,
        }
    };

    export const makeInterpolationMatrix = (dataArray, dimension ) => {
        if ( dimension == 2 ) {
            return makeQuadraticMatrix(dataArray);
        } else if ( dimension == 3 ) {
            return makeCubicMatirx(dataArray);
        }
        return;
    };

    export const makeGauseEliminationMatrix = ( matrix , resultV ) => {
		if ( !matrix ) {
			return;
		}
        const orgLen = matrix.length;
        if ( !orgLen ) 
            return;

        let rows = -1;
        let cols = -1;

        if ( matrix.rows && matrix.cols ) {
            rows = matrix.rows;
            cols = matrix.cols;
        } else {
            rows = Math.sqrt(orgLen);
            cols = rows;
        }

		if ( rows*rows != orgLen ) {
			return;
        }
        if ( !resultV ) {
            return;
        }

        let iRows = -1;
        let iCols = -1;
        if ( resultV.length == rows ) {
            iRows = rows;
            iCols = 1;
        } else if ( resultV.rows && resultV.cols ) {
            iRows = resultV.rows;
            iCols = resultV.cols;
        }
        if ( iRows != rows ) 
            return;

        resultV.rows = iRows;
        resultV.cols = iCols;
		
		const orgV = copyMatrixValues(matrix);
        const inverseV = copyMatrixValues(resultV);  
		for ( let r = 0; r < rows; r++ ) {
			let stIdx = r*cols+r;
			while ( orgV[stIdx] == 0 ) {
				let canCalc = false;
				for ( let t = r+1; t < rows; t++ ) {
					switchRowPositionValues(orgV, cols, r, t);
                    switchRowPositionValues(inverseV, iCols, r, t);                    

					if ( orgV[stIdx] != 0 ) {
						canCalc = true;
						break;
					}
				}
				if ( !canCalc ) {
					return;
				}
			}
			let sv = orgV[stIdx];
			let sIdx = r*cols;
            let cIdx = r*iCols;
			for ( let c = 0; c < cols; c++ ) {
				orgV[sIdx+c] /= sv;
                if ( c < iCols )
				    inverseV[cIdx+c] /= sv;
			}
			for ( let t = r+1; t < rows; t++ ) {
				let tIdx = t*cols;
                let tcIdx = t*iCols;
				sv = orgV[tIdx+r];
				for ( let c = 0; c < cols; c++ ) {
					orgV[tIdx+c] -= (sv*orgV[sIdx+c]);
                    if ( c < iCols )
					    inverseV[tcIdx+c] -= (sv*inverseV[cIdx+c]);;
				}
			}
		}

		for ( let r = rows-1; r > 0; r-- ) {
			let sIdx = r*cols;
            let cIdx = r*iCols;
			for ( let t = r-1; t >= 0; t-- ) {
				let tIdx = t*cols;
                let tcIdx = t*iCols;
				let sv = orgV[tIdx+r];

				for ( let c = 0; c < cols; c++ ) {
					orgV[tIdx+c] -= ( sv * orgV[sIdx+c]);
                    if ( c < iCols )
					    inverseV[tcIdx+c] -= (sv*inverseV[cIdx+c]);
				}
			}
		}
		return inverseV;
	};

    /*
//https://adnoctum.tistory.com/146
bool cubic_spline(std::vector<double>* x_series, std::vector<double>* y_series, std::vector<double> *destX, std::vector<double>* destY)
{   
    int n = __min((int)x_series->size()-1, (int)y_series->size()-1);
    // Step 1.
    double *h = new double[n+1];
    double *alpha = new double[n+1];
    int i = 0;
    for(i = 0; i<=n-1; i++){
        h[i] = (*x_series)[i+1] - (*x_series)[i];
    }
    // Step 2.
    for(i = 1; i<=n-1;i++){
        alpha[i]= 3*((*y_series)[i+1]-(*y_series)[i])/h[i]-3*((*y_series)[i]-(*y_series)[i-1])/h[i-1];
    }
    // Step 3.
    double *l = new double[n+1];
    double *u = new double[n+1];
    double *z = new double[n+1];
    double *c = new double[n+1];
    double *b = new double[n+1];
    double *d = new double[n+1];

    l[0] = 1; u[0] = 0; z[0] = 0;
    // Step 4.
    for(i = 1; i<=n-1; i++){
        l[i] = 2*((*x_series)[i+1] - (*x_series)[i-1]) - h[i-1]*u[i-1];
        u[i] = h[i]/l[i];
        z[i] = (alpha[i] - h[i-1]*z[i-1]) / l[i];
    }

    // Step 5.
    l[n] = 1;     z[n] = 0;     c[n] = 0;
    // Step 6.
    for(i = n-1; i>=0; i--){
        c[i] = z[i] - u[i]*c[i+1];
        b[i] = ((*y_series)[i+1] - (*y_series)[i])/h[i] - h[i]*(c[i+1] + 2*c[i])/3;
        d[i] = (c[i+1] - c[i]) / (3*h[i]);
    }
    for(i = 0; i<=n-2;i++){
        double x = (*x_series)[i];
        double inc = ((*x_series)[i+1] - (*x_series)[i])*0.1;
        for(; x < (*x_series)[i+1]; x+=inc){
            double x_offset = x - (*x_series)[i];
            double Sx = (*y_series)[i] + b[i]*x_offset + c[i]*x_offset*x_offset + d[i]*x_offset*x_offset*x_offset;
            if(destX != NULL){
                destX->push_back(x);
            }
            if(destY != NULL){
                destY->push_back(Sx);
            }
        }           
    }

    delete [] h;
    delete [] alpha;
    delete [] l;
    delete [] u;
    delete [] z;
    delete [] c;
    delete [] b;
    delete [] d;

    return true;
}
    */

    export const printArrayValues = ( mat, roundValue ) => {
        let ts = "";
        if ( !mat ) 
            return ts;
        let len = mat.length;
        if ( !len )
            return ts;
        let rows = mat.rows;
        let cols = mat.cols;
        if ( !rows || !cols) {
            for ( let i = 0; i < len; i++ ) {
                ts += "\t" + mat[i];
            }
            return ts;
        }
        if ( !roundValue ) {
            roundValue = 1000000.0;
        }
        for ( let i = 0; i < rows; i++ ) {
            for ( let j = 0; j < cols; j++ ) {
                ts += "\t" + Math.round(mat[i*cols+j]*roundValue)/roundValue;
            }
            ts += "\n";
        }
        return ts;
    };


	export const makeRotateXMatrix3D = ( theta ) => {
		let sv = Math.sin(theta);
		let cv = Math.cos(theta);

        const result = new Float32Array([
			1,  0,  0, 0,
			0,	cv, -sv, 0,
			0,  sv,  cv, 0,
			0,  0,  0, 1
		]);
        result.rows = 4;
        result.cols = 4;
        return result;
	};

	export const makeRotateYMatrix3D = ( theta ) => {
		let sv = Math.sin(theta);
		let cv = Math.cos(theta);

        const result = new Float32Array([
			cv,  0,  sv,0,
			0,	 1, 0,0,
			-sv,  0,  cv,0,
			0,  0,  0, 1
		]);
        result.rows = 4;
        result.cols = 4;
        return result;
	};

	export const makeRotateZMatrix3D = ( theta ) => {
		let sv = Math.sin(theta);
		let cv = Math.cos(theta);

        const result = new Float32Array([
			cv, -sv,   0, 0,
			sv,  cv,   0, 0,
			0,   0,   1, 0,
			0,  0,  0, 1,
		]);
        result.rows = 4;
        result.cols = 4;
        return result;
	};

    export const makeScaleMatrix3D = ( sx, sy, sz ) => {
        const result = new Float32Array([
			sx, 0,  0,  0,
			0, sy,  0,  0, 
			0,  0, sz,	0,
			0,  0,  0,	1
		]);
        result.rows = 4;
        result.cols = 4;
        return result;
	};


	export const makeTranslateMatrix3D = ( dx, dy, dz ) => {

        const result = new Float32Array([
			1, 0,  0,  dx,
			0, 1,  0,  dy, 
			0,  0, 1,  dz,
			0,  0,  0,	1
		]);
        result.rows = 4;
        result.cols = 4;
        return result;
	};

    export const makeCameraMatrix3D = ( eye, at, up ) => {
        //  z 축의 방향 at 에서 eye 방향으로 설정
        let nObj = makeNormalizeVector( makeVectorMinusValues(eye,at) );

        //  n(z) vector 에서 up 으로 진행 u(x) vector 를 구함 cross product 는 두 벡터 평면에 수직
        let uObj = makeNormalizeVector( makeVectorCrossProductValues(up, nObj));

        //  u(x) 에서 n(z) 축 방향으로 cross product v(y) 방향 vector 를 구함
        //  이미 normalize 된 수직인 두 벡터의 cross product 결과는 normalize 된 벡터 
        let vObj = makeVectorCrossProductValues(nObj,uObj);

        //  world 공간의 원점을 통합하기 위해서 translate 이후 rotation 진행
        //  translate 는 eye 값을 -부호 붙이값 
        //  rotation 은 u, v, n 의 transpose 값으로 얻음
        const translate = makeTranslateMatrix3D(-eye[0], -eye[1], -eye[2]) ;
        const rotate = new Float32Array([
            uObj[0], uObj[1], uObj[2], 0,
            vObj[0], vObj[1], vObj[2], 0,
            nObj[0], nObj[1], nObj[2], 0,
            0, 0, 0, 1            
        ]);
        rotate.rows = 4;
        rotate.cols = 4;

        const result = multiplyMatrix(rotate, translate);
        //const result = multiplyMatrix(translate, rotate);        

//        console.log ( result );
        return result;
    };

    export const makeCameraInverseMatrix3D = ( eye, at, up ) => {
        //  z 축의 방향 at 에서 eye 방향으로 설정
        let nObj = makeNormalizeVector( makeVectorMinusValues(eye,at) );

        //  n(z) vector 에서 up 으로 진행 u(x) vector 를 구함 cross product 는 두 벡터 평면에 수직
        let uObj = makeNormalizeVector( makeVectorCrossProductValues(up, nObj));

        //  u(x) 에서 n(z) 축 방향으로 cross product v(y) 방향 vector 를 구함
        //  이미 normalize 된 수직인 두 벡터의 cross product 결과는 normalize 된 벡터 
        let vObj = makeVectorCrossProductValues(nObj,uObj);

        //  world 공간의 원점을 통합하기 위해서 translate 이후 rotation 진행
        //  translate 는 eye 값을 -부호 붙이값 
        //  rotation 은 u, v, n 의 transpose 값으로 얻음
        const rotate = new Float32Array([
            uObj[0], vObj[0], nObj[0], eye[0],
            uObj[1], vObj[1], nObj[1], eye[1],
            uObj[2], vObj[2], nObj[2], eye[2],
            0, 0, 0, 1            
        ]);
        rotate.rows = 4;
        rotate.cols = 4;
        return rotate;
    };



	function lookupCameraMatrix(eye,at,up) {
		let nObj = makeMinusVectors(eye,at);
		nObj = makeNormalizeVector(nObj);
		nObj.push(0);
		let uObj = makeCrossProductVectors(up,nObj);
		uObj = makeNormalizeVector(uObj);
		uObj.push(0);
		let vObj = makeCrossProductVectors(nObj,uObj);
		vObj.push(0);

		let trm = makeTranslateMatrix3D(-eye[0], -eye[1], -eye[2]);
//		alert ( makeRowVectorFromColumn(at,1) );
//		trm = multiplyFn(trm,makeRowVectorFromColumn(at,1));
		let uvn = [uObj,vObj,nObj,[0,0,0,1]];

//		alert ("mmm " + uvn + "\n" + trm );

		return makeRoundValues(multiplyFn(uvn,trm));
	};

    /**
     * 
     * @param {*} light : 빛 벡터 
     * @param {*} normal  : normal vector
     * @param {*} isNormalized : true : nomalized , false : need normalize
     * @param {*} isReversed : true : 빛이 진행방향에서 법선과 동일한 방향으로 변경되어 있음, false : 빛의 원래 진행방향 
     * @returns 
     */
    export const makeReflectRayVector = ( light, normal, isNormalized,  isReversed ) => {
        let lightDir, normalDir, reflectDir;
        if ( !isNormalized ) {
            lightDir = makeNormalizeVector(light);
            normalDir = makeNormalizeVector(normal);
        } else {
            lightDir = light;
            normalDir = normal;
        }
        if ( isReversed ) {
            const v = makeDotProductVectors(lightDir,normalDir)*2.0;
            reflectDir = normalDir;
            for ( let i = 0; i < reflectDir.length; i++ ) {
                reflectDir[i] *= v;
            }
            reflectDir = makeVectorMinusValues(reflectDir, lightDir);
        } else {
            const v = makeDotProductVectors(lightDir,normalDir)*-2.0;
            reflectDir = normalDir;
            for ( let i = 0; i < reflectDir.length; i++ ) {
                reflectDir[i] *= v;
            }
            reflectDir = makeVectorPlusValues(reflectDir, lightDir);
        }
        return reflectDir;
    };

   
    /**
     * 
     * @param {*} screenX : canvas base offsetX 0 ~ width ( left to right)
     * @param {*} screenY : canvas base offsetY 0 ~ height ( top to bottom )
     * @param {*} width : fullWidth
     * @param {*} height : fullHeight 
     * @param {*} fovy : radian value
     * @param {*} near : projection matrix 의 가까운 지점 
     * @param {*} eye : camera eye pos
     * @param {*} at : camera target pos
     * @param {*} up : camera 기울기 방향
     */
    export const makeRayTracingViewPosValues = ( screenX,screenY,width,height, fovy, near, eye, at, up ) => {
        const cv = cot(fovy/2);
        const aspect = width/height;
        const xc = (near/(cv/aspect))*(2*screenX/width - 1);
        const yc = -(near/(cv))*(2*screenY/height - 1);

        const viewInverseMatrix = makeCameraInverseMatrix3D(eye,at,up);        

        const startPos = vec4(xc,yc,-near,1);
        const startRay = vec4(xc/near,yc/near,-1,0); 

        const viewPos = multiplyMatrix(viewInverseMatrix, startPos);
        const viewRay = multiplyMatrix(viewInverseMatrix, startRay);        

        return {
            viewPos : viewPos,
            viewRay : viewRay,
        };
    };

    /**
     * 
     * @param {*} viewPosValues : viewPos, viewRay 
     * @param {*} localWorldMatrix : object local world matrix
     */
    export const makeRayTracingLocalWorldPosValues = ( viewPosValues, localWorldMatrix ) => {

        const worldInverseMatrix = makeInverseMatrix(localWorldMatrix);
        const worldPos = multiplyMatrix(worldInverseMatrix, viewPosValues.viewPos);
        const worldRay = multiplyMatrix(worldInverseMatrix, viewPosValues.viewRay);        

        return {
            worldPos : worldPos,
            worldRay : worldRay,
        };
    };

    export const traceRayInterceptionForSphere = (rayPos,rayDir,sphereCenter,sphereRadius) => {

        const a = rayDir[0]*rayDir[0] + rayDir[1]*rayDir[1] + rayDir[2]*rayDir[2]; 
        const b = 2*(rayDir[0]*rayPos[0]+rayDir[1]*rayPos[1] + rayDir[2]*rayPos[2] - rayDir[0]*sphereCenter[0]-rayDir[1]*sphereCenter[1] - rayDir[2]*sphereCenter[2]);
        const c = rayPos[0]*rayPos[0] + rayPos[1]*rayPos[1] + rayPos[2]*rayPos[2] - 2 * ( rayPos[0]*sphereCenter[0] + rayPos[1]*sphereCenter[1] + rayPos[2]*sphereCenter[2]) 
            + sphereCenter[0]*sphereCenter[0] + sphereCenter[1]*sphereCenter[1] + sphereCenter[2]*sphereCenter[2] - sphereRadius*sphereRadius;

        const oc = makeVectorMinusValues(rayPos,sphereCenter);

        const a1 = makeDotProductVectors(rayDir,rayDir); 
        const b1 = 2*makeDotProductVectors(rayDir,oc);
        const c1 = (makeDotProductVectors(oc,oc) - sphereRadius*sphereRadius);

        const rd = 10000;

        alert ( Math.round(a*10000)/10000 + " : " + Math.round(a1*rd)/rd + "\n" + Math.round(b*rd)/rd + " : " + Math.round(b1*rd)/rd 
            + "\n" + Math.round(c*rd)/rd + " : " + Math.round(c1*rd)/rd);

        if ( (b*b - 4*a*c) < 0 ) {
            return undefined;
        }

        const hitDis01 = ((-b + Math.sqrt(b*b-4*a*c))/2*a);
        const hitDis02 = ((-b - Math.sqrt(b*b-4*a*c))/2*a);

        if ( hitDis01 < 0 && hitDis02 < 0 ) {
            //  방향이 반대
            return undefined;
        }

        let distance = hitDis01;
        let otherDistance = hitDis02;
        let otherHitPoint = vec3(0,0,0);
        if ( distance < 0 ) {
            //  양수의 값을 취함
            distance = hitDis02;
            otherDistance = hitDis01;
            otherHitPoint = makeVectorPlusValues(rayPos,makeVectorMultiplyScalarValues(rayDir,hitDis01));
        } else {
            if ( distance > hitDis02 && hitDis02 > 0 ) {
                distance = hitDis02;
                otherDistance = hitDis01;
            } else {
                otherDistance = hitDis02;
                otherHitPoint = makeVectorPlusValues(rayPos,makeVectorMultiplyScalarValues(rayDir,hitDis02));
            }
        }

        const hitPoint = makeVectorPlusValues(rayPos,makeVectorMultiplyScalarValues(rayDir,distance));
        const normal = makeNormalizeVector(makeVectorMinusValues(hitPoint,sphereCenter));

        return {
            hitPoint:hitPoint,
            distance:distance,
            normal:normal,
            otherHitPoint:otherHitPoint,
            otherDistance:otherDistance,
        };
    };

    export const traceRayInterceptionForTriangles = (rayPos,rayDir, t1, t2, t3) => {
        const t2from1 = makeVectorMinusValues(t2,t1);
        const t3from1 = makeVectorMinusValues(t3,t1);
        const normal = makeNormalizeVector(makeVectorCrossProductValues(t2from1, t3from1)); //   시작위치가 먼저, 대상이 다음 - 오른손 법칙

        const rayDotValue = makeDotProductVectors(rayDir, normal);
        if ( rayDotValue < 0.001 && rayDotValue > -0.001 ) {
            return undefined;
        }

        const rayValue = makeDotProductVectors( makeVectorMinusValues(t1,rayPos), normal);
        const tValue = (rayValue/rayDotValue);

        const hitPoint = makeVectorPlusValues(rayPos,makeVectorMultiplyScalarValues(rayDir,tValue));

        const aPos1 = makeVectorCrossProductValues( t2from1, makeVectorMinusValues(hitPoint,t1) ) ; // T3 Ratio aPos1 이 크면 T3 에 가깝다는 의미 
        const a1Dir = makeVectorDotProductValues(aPos1, normal);  
        if ( a1Dir < 0 ) {
            return undefined;
        }
        
        const aPos2 = makeVectorCrossProductValues( makeVectorMinusValues(t3,t2), makeVectorMinusValues(hitPoint,t2) ) ; // T1 Ratio aPos2 이 크면 T1 에 가깝다는 의미 
        const a2Dir = makeVectorDotProductValues(aPos2, normal);        
        if ( aPos2 < 0 ) {
            return undefined;
        }
        const aPos3 = makeVectorCrossProductValues( makeVectorMinusValues(t1,t3), makeVectorMinusValues(hitPoint,t3) ) ; // T2 Ratio aPos3 이 크면 T2 에 가깝다는 의미 
        const a3Dir = makeVectorDotProductValues(aPos3, normal);           
        if ( a3Dir < 0 )
            return undefined;

        
        const a01 = getVectorLength(aPos2);
        const a02 = getVectorLength(aPos3);        
        const a03 = getVectorLength(aPos1);            
        
        const aSum = (a01+a02+a03);
        const a1Ratio = (a01/aSum);
        const a2Ratio = (a02/aSum);
        const a3Ratio = (1-a1Ratio-a2Ratio); // (a03/aSum)

        return {
            hitPoint : hitPoint,
            distance : tValue,
            normal:normal,
            ratio1 : a1Ratio,
            ratio2 : a2Ratio, 
            ratio3 : a3Ratio
        };
    };

	export const makeQuaternionValueFormAxisAngle = (theta, axis) => {
		if ( !axis || axis.length != 3) {
			return vec4(0,0,0,0);
		}

		const sv = Math.sin(theta)/2;
		const cv = Math.cos(theta)/2;
		const result = vec4(0,0,0,0);
		for( let i = 0; i < 3; i++ ) {
			result[i] = (axis[i]*sv);
		}
		result[3]= (cv);
		return result;
	}

    /**
     * 
     * @param {*} cx : mouse click x 좌표 ( 0 ~ fw ) 왼쪽에서 오른쪽 방향
     * @param {*} cy : mouse click y 좌표 ( 0 ~ fh ) 위쪽에서 아래쪽 방향
     * @param {*} fw : 전체 가로 길이
     * @param {*} fh : 전체 세로 길이
     * @returns 
     */
    export const makeArcballValues = (cx, cy, fw, fh) => {
        let tx = ((2*cx)/fw - 1.0);
        let ty = (1.0- (2*cy)/fh);
        let tSum = tx*tx + ty*ty;
        if ( tSum <= 1.0 ) {
            return vec3(tx, ty, Math.sqrt(1-tSum));
        } else {
            return makeNormalizeVector(vec3(tx,ty,0));
        }
    };

    export const calculateAxisAngles = (sx,sy, ex,ey,fw,fh) => {
        const vs = makeArcballValues(sx,sy, fw, fh);
        const ve = makeArcballValues(ex,ey, fw, fh);
        const rdv = Math.acos(Math.max(-1.0,Math.min(1.0, makeDotProductVectors(vs, ve))));
        const vCross = makeNormalizeVector(makeVectorCrossProductValues(vs,ve));
        return makeNormalizeVector(makeQuaternionValueFormAxisAngle(rdv,vCross));
    };

    export const makeQuaternionMatrix = (qx,qy,qz,qw) => {
		let qy2 = qy*qy;
		let qx2 = qx*qx;
		let qz2 = qz*qz;

		const result = new Float32Array([
			1 - 2*qy2 - 2*qz2,	2*qx*qy - 2*qz*qw,	2*qx*qz + 2*qy*qw, 0,
			2*qx*qy + 2*qz*qw, 1 - 2*qx2 - 2*qz2,	2*qy*qz - 2*qx*qw, 0,
			2*qx*qz - 2*qy*qw,	2*qy*qz + 2*qx*qw,	1 - 2*qx2 - 2*qy2, 0,
			0,0,0,1
        ]);
        result.rows = 4;
        result.cols = 4;
		return result;
	};

    export const makeLinearInterpolation = (a,b,t) => {
        return (a*(1-t) + b*t);
    };

    //  perlin noise 소스에서 구성함 - 3 차원 
    const perlinArray = new Uint32Array(512);
    const perlinPermutation = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
        36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
        75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
        149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
        27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
        92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
        209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
        164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
        147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
        28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
        155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
        178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
        191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
        181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
        61, 156, 180,
    ];
      
    for (let i = 0; i < 256; i++) {
        perlinArray[256 + i] = perlinArray[i] = perlinPermutation[i];
    };
    
    const perlinFade = (t) => {
        return t*t*t*(t*(t*6-15)+10);
    };

    const perlinLerp = ( t, a, b ) => {
        return a + t * (b-a);
    };

    const perlinGrad = (hash, x, y, z) => {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : ( h == 12 || h == 14 ? x : z);
        return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
    };

    const perlinGrad1D = (i,x) => {
        return (i&1) === 0 ? -x : x;
    };

    const perlinGrad2D = (i,x,y) => {
        let v = (i & 1) === 0 ? x : y;
        return (i&2) === 0 ? -v : v;
    };

    export const perlinImprovedNoise1D = (x) => {
        const X = (Math.floor(x)&255);
        let xf = x - Math.floor(x);
        const fx = perlinFade(xf);
        return perlinLerp(fx, perlinGrad1D(perlinArray[X], xf), perlinGrad1D(perlinArray[X+1], xf-1));
    };

    export const perlinImprovedNoise2D = (x,y) => {
        const X = (Math.floor(x)&255);
        const Y = (Math.floor(y)&255);
        let xf = x - Math.floor(x);
        let yf = y - Math.floor(y);
        const fx = perlinFade(xf);
        const fy = perlinFade(yf);
        const p0 = perlinArray[X]+Y;
        const p1 = perlinArray[X + 1] + Y;
        return perlinLerp( fy, 
            perlinLerp(fx, perlinGrad1D(perlinArray[p0], xf,yf), perlinGrad1D(perlinArray[p1], xf-1,yf)),
            perlinLerp(fx, perlinGrad1D(perlinArray[p0+1], xf,yf-1), perlinGrad1D(perlinArray[p1+1], xf-1,yf-1))
        );
    };    

    export const perlinImprovedNoise3D = (x,y,z) => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;

        let xf = x - Math.floor(x);
        let yf = y - Math.floor(y);
        let zf = z - Math.floor(z);
        
        const u = perlinFade(xf);
        const v = perlinFade(yf);
        const w = perlinFade(zf);

        const A = perlinArray[X] + Y;
        const AA = perlinArray[A] + Z;
        const AB = perlinArray[A+1] + Z;
        const B = perlinArray[X+1] + Y;
        const BA = perlinArray[B] + Z;
        const BB = perlinArray[B+1] + Z;

        return perlinLerp(
            w,
            perlinLerp(
              v,
              perlinLerp(u, perlinGrad(perlinArray[AA], xf, yf, zf), perlinGrad(perlinArray[BA], xf - 1, yf, zf)),
              perlinLerp(u, perlinGrad(perlinArray[AB], xf, yf - 1, zf), perlinGrad(perlinArray[BB], xf - 1, yf - 1, zf))
            ),
            perlinLerp(
              v,
              perlinLerp(u, perlinGrad(perlinArray[AA + 1], xf, yf, zf - 1), perlinGrad(perlinArray[BA + 1], xf - 1, yf, zf - 1)),
              perlinLerp(
                u,
                perlinGrad(perlinArray[AB + 1], xf, yf - 1, zf - 1),
                perlinGrad(perlinArray[BB + 1], xf - 1, yf - 1, zf - 1)
              )
            )
        );        
    };

    export const perlinNoiseOctaveValue1D = ( x, amplitude, frequency, octaveCount, persistence, lacunarity ) => {
        let value = 0;
        for ( let i = 0; i < octaveCount; i++ ) {
            value += (amplitude*perlinImprovedNoise1D(x*frequency));
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        return value;
    };

    export const perlinNoiseOctaveValue2D = ( x, y, amplitude, frequency, octaveCount, persistence, lacunarity ) => {
        let value = 0;
        for ( let i = 0; i < octaveCount; i++ ) {
            value += (amplitude*perlinImprovedNoise2D(x*frequency,y*frequency));
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        return value;
    };

    export const perlinNoiseOctaveValue3D = ( x, y, z, amplitude, frequency, octaveCount, persistence, lacunarity ) => {
        let value = 0;
        for ( let i = 0; i < octaveCount; i++ ) {
            value += (amplitude*perlinImprovedNoise3D(x*frequency,y*frequency,z*frequency));
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        return value;
    };

    export const makeFrictionValues = (velocity, normalFace, frictionCoef) => {
        const frictionVec = makeNormalizeVector(velocity);
        const coef = frictionCoef * normalFace * -1;
        makeVectorAccelationMultiplyScalarValues(frictionVec, coef);
        return frictionVec;
    };

    export const makeDragForceValues = ( velocity, p, area, dragCoef) => {
        const v = getVectorLength(velocity);
        const coef = (-0.5 * p * area * dragCoef * v * v);
        const dragVec = makeNormalizeVector(velocity);
        return makeVectorAccelationMultiplyScalarValues(dragVec, coef);
    };

    export const makeUniversalGravitationValues = ( mainMass, mainPos, moverMass, moverPos, gravityCoef) => {
        const vec = makeVectorMinusValues(mainPos,moverPos);
        let distance = getVectorLength(vec);
        if ( distance < 5 )
            distance = 5;

        if ( distance > 25 )
            distance = 25;

        const dir = makeNormalizeVector(vec);
        const coef = ((gravityCoef*mainMass*moverMass)/(distance*distance));
        return makeVectorAccelationMultiplyScalarValues(dir,coef);
    };

    










    
    