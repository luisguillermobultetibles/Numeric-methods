       // Return the (x, y, z) Interpolation's.
        // @points An array of [[x1, y1, weighs1], ..., [xN, yN, weighsN]]
        // @point  A single [x, y] point.
        // @n      Dimension's, use n > 0 to pondered regression (eg 1 tendency line) or n<0 to ordinary regression (eg -2 least mean squares).
        // @sample interpolation([[0, 0, 1], [1, 0, 2]], [0.5,0], -2)
        // @sample interpolation([[0, 0, 1], [1, 0, 2]], [0.5,0], -1)
        // @sample interpolation([[0, 0, 1], [1, 0, 2]], [0.5,0],  0)
        // @sample interpolation([[0, 0, 1], [1, 0, 2]], [0.5,0],  1)
        // @sample interpolation([[0, 0, 1], [1, 0, 2]], [0.5,0],  2)
        function interpolation(points, point, n = 2) {
            let distancia2D = (p1, p2) => {
                return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
            };
            let _dist;
            let sumaNumerador;
            let sumaDenominador;
            points.forEach((elemento, Index) => {
                _dist = distancia2D(point, elemento);
                if (Index === 0) {
                    sumaNumerador = Math.pow(_dist, Math.sign(n)) * Math.pow(elemento[2], Math.abs(n) + (1 - Math.sign(n)) / 2);
                    sumaDenominador = Math.pow(_dist, Math.sign(n)) * Math.pow(elemento[2], Math.abs(n) - (2 - Math.sign(n)) / 2);
                } else {
                    sumaNumerador += Math.pow(_dist, Math.sign(n)) * Math.pow(elemento[2], Math.abs(n) + (1 - Math.sign(n)) / 2);
                    sumaDenominador += Math.pow(_dist, Math.sign(n)) * Math.pow(elemento[2], Math.abs(n) - (2 - Math.sign(n)) / 2);
                }
            })
            return sumaNumerador / sumaDenominador;
        }

