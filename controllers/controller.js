const axios = require('axios');


exports.getPosts = (req, res) => {

    const { tags, sortBy, direction } = req.params;
    const sortByPossibilities = [
        'id',
        'author',
        'authorId',
        'likes',
        'popularity',
        'reads',
        'tags',
        undefined
    ];
    const directionPossibilities = ['asc', 'desc', undefined]

    console.log(direction);

    if (!directionPossibilities.includes(direction)) {
        return res.status(400).send({
            error: "SortBy value is an incorrect one",
          });
    }


    if (!sortByPossibilities.includes(sortBy)) {
        return res.status(400).send({
            error: "SortBy value is an incorrect one",
          });
    }


    if ( tags.includes(",")) {
        var tagsArray = tags.split(",");
        var requests = [];
        tagsArray.forEach((tag, i) => {
            requests[i] = axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
        });


        axios.all([...requests])
        .then(axios.spread((reqOne, reqTwo, reqThree, reqFour, reqFive, reqSix, reqSeven, reqEight) => {
            const temp = [];   

            function Check(request) {
                if (request) {
                    request = request.data.posts;
                    let len = request.length

                    for (var i= 0; i < len; i++) {
                        temp.push(request[i])
                    }
                    
                } else {
                    return request = '';
                }
            }

            Check(reqOne);
            Check(reqTwo);
            Check(reqThree);
            Check(reqFour);
            Check(reqFive);
            Check(reqSix);
            Check(reqSeven);
            Check(reqEight);


            //  Array.from turns the Set back into an array
            //  Set only takes in unique addresses 
            let originalResults = Array.from(new Set(temp.map(a => a.id)))
             .map(id => {
               return temp.find(a => a.id === id)
             })


            //  Sorting
            if (sortBy) {
                // sorting based on property by ascending
                if (direction === 'asc') {
                    originalResults = originalResults.sort((a, b) => {
                        if (a[sortBy] > b[sortBy]) {
                            return 1
                        } else {
                            return -1
                        }
                    })
                } else {
                // sorting based on property by descending
                    originalResults = originalResults.sort((a, b) => {
                        if (a[sortBy] < b[sortBy]) {
                            return 1
                        } else {
                            return -1
                        }
                    })
                }
            }
            res.status(200).send(originalResults);

        }))
        .catch(error => {
            res.status(400).send({
              error: 'A tag is required in order to make this request',
            })
            console.log(error)
          });
    } else {

        axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
        .then( request => {
            const results = request.data.posts;

            if (sortBy) {
                // sorting based on property by ascending
                if (direction === 'asc') {
                    results = results.sort((a, b) => {
                        if (a[sortBy] > b[sortBy]) {
                            return 1
                        } else {
                            return -1
                        }
                    })
                } else {
                // sorting based on property by descending
                    results = results.sort((a, b) => {
                        if (a[sortBy] < b[sortBy]) {
                            return 1
                        } else {
                            return -1
                        }
                    })
                }
            }
        res.status(200).send(results);            
        })
        .catch(error => {
            res.status(400).send({
              error: 'A tag is required in order to make this request',
            })
            console.log(error)
          });
    }
}

