exports.validation = (req, res, next) => {

    let validCondition = (condition) => {
        const arrayOfStrings = ['eq', 'neq', 'gt', 'gte', 'contains'];
        let found = arrayOfStrings.find(v => (condition === v));
        return typeof found;
    };

    function checkNested(obj, level, ...rest) {
        let result;
        if (obj === undefined) {
            result = false; //return false
            return result;
        }
        if (rest.length == 0 && obj.hasOwnProperty(level)) {
            result = true;
            return result;
        }
        return checkNested(obj[level], ...rest);
    }

    function getNested(obj, ...args) {
        return args.reduce((obj, level) => obj && obj[level], obj)
      }

    const {
        rule,
        data
    } = req.body;

    const {
        field,
        condition,
        condition_value
    } = rule;

    let realCondition;
    if(condition == 'eq') realCondition = "==";
    if(condition == 'neq') realCondition = "!=";
    if(condition == 'gt') realCondition = ">";
    if(condition == 'gte') realCondition = ">=";
    if(condition == 'contains') realCondition = "contains";

    // res.json({
    //     field: data[field],
    //     condition: realCondition,
    //     condition_value: condition_value
    // });


    if (!rule) {
        res.status(400).json({
            message: "rule is required.",
            status: "error",
            data: null
        });
    } else if (!data) {
        res.status(400).json({
            message: "data is required.",
            status: "error",
            data: null
        });
    } else if ((typeof rule !== 'object')) {
        res.status(400).json({
            message: "rule should be an object.",
            status: "error",
            data: null
        });
    } else if ((typeof data !== 'object') && !Array.isArray(data) && (typeof data !== 'string')) {
        res.status(400).json({
            message: "data should be a|an object|array|string.",
            status: "error",
            data: null
        });
    } else if (!field || !condition || !condition_value || (typeof field !== 'string') ||
        (typeof condition !== 'string') || (validCondition(condition) === "undefined") ||
        (field.split(".").length > 2)) {
        res.status(400).json({
            message: "Invalid JSON payload passed.",
            status: "error",
            data: null
        });
    } else if (field.split(".").length > 1) {
        if (!checkNested(data, field.split(".")[0], field.split(".")[1])) {
            res.status(400).json({
                message: `field ${field} is missing from data.`,
                status: "error",
                data: null
            });
        } else {
            if(condition !== 'contains') {
                if(eval(`${getNested(data, field.split(".")[0], field.split(".")[1])} ${realCondition} ${condition_value}`)) {
                    res.status(200).json({
                        message: `field ${field} successfully validated.`,
                        status: "success",
                        data: {
                            validation: {
                              error: false,
                              field: `${field}`,
                              field_value: getNested(data, field.split(".")[0], field.split(".")[1]),
                              condition: condition,
                              condition_value: condition_value
                            }
                          }
                    });
                } else {
                    res.status(400).json({
                        message: `field ${field} failed validation.`,
                        status: "error",
                        data: {
                            validation: {
                              error: true,
                              field: `${field}`,
                              field_value: getNested(data, field.split(".")[0], field.split(".")[1]),
                              condition: condition,
                              condition_value: condition_value
                            }
                          }
                    });
                }
            } else {
                if(`${getNested(data, field.split(".")[0], field.split(".")[1])}`.includes(`${condition_value}`)) {
                    res.status(200).json({
                        message: `field ${field} successfully validated.`,
                        status: "success",
                        data: {
                            validation: {
                              error: false,
                              field: `${field}`,
                              field_value: getNested(data, field.split(".")[0], field.split(".")[1]),
                              condition: condition,
                              condition_value: condition_value
                            }
                          }
                    });
                } else {
                    res.status(400).json({
                        message: `field ${field} failed validation.`,
                        status: "error",
                        data: {
                            validation: {
                              error: true,
                              field: `${field}`,
                              field_value: getNested(data, field.split(".")[0], field.split(".")[1]),
                              condition: condition,
                              condition_value: condition_value
                            }
                          }
                    });
                }
            }
        }
    } else if (!data.hasOwnProperty(field) && field.split(".").length <= 1 && typeof rule !== 'object') {
        res.status(400).json({
            message: `field ${field} is missing from data.`,
            status: "error",
            data: null
        });
    }

    if(typeof rule === 'object') {
        if(condition !== 'contains') {
            if(eval(`${data[field]} ${realCondition} ${condition_value}`)) {
                res.status(200).json({
                    message: `field ${field} successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                          error: false,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            } else {
                res.status(400).json({
                    message: `field ${field} failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                          error: true,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            }
        } else {
            if(`${data[field]}`.includes(`${condition_value}`)) {
                res.status(200).json({
                    message: `field ${field} successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                          error: false,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            } else {
                res.status(400).json({
                    message: `field ${field} failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                          error: true,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            }
        }       
    } else if(Array.isArray(data)) {
        // array start
        if(condition !== 'contains') {
            if(eval(`${data[field]} ${realCondition} ${condition_value}`)) {
                res.status(200).json({
                    message: `field ${field} successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                          error: false,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            } else {
                res.status(400).json({
                    message: `field ${field} failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                          error: true,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            }
        } else {
            if(`${data[field]}`.includes(`${condition_value}`)) {
                res.status(200).json({
                    message: `field ${field} successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                          error: false,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            } else {
                res.status(400).json({
                    message: `field ${field} failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                          error: true,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            }
        }
        // array end
    } else if (typeof data === 'string') {

        // string start
        if(condition !== 'contains') {
            if(eval(`${data[field]} ${realCondition} ${condition_value}`)) {
                res.status(200).json({
                    message: `field ${field} successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                          error: false,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            } else {
                res.status(400).json({
                    message: `field ${field} failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                          error: true,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            }
        } else {
            if(`${data[field]}`.includes(`${condition_value}`)) {
                res.status(200).json({
                    message: `field ${field} successfully validated.`,
                    status: "success",
                    data: {
                        validation: {
                          error: false,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            } else {
                res.status(400).json({
                    message: `field ${field} failed validation.`,
                    status: "error",
                    data: {
                        validation: {
                          error: true,
                          field: `${field}`,
                          field_value: data[field],
                          condition: condition,
                          condition_value: condition_value
                        }
                      }
                });
            }
        }   
        // string end

    }
    res.status(400).json({
        message: "rule should be an object.",
        status: "error",
        data: null
    });

}