enum statuscodes {
    SUCCESS=200,
    UPDATE=200,
    INSERT=201,
    INPUT_ACCEPT=202,
    INSERT_FAIL=204,
    FAIL=204,
    AUTHORIZATION=401,
    INVALID_REQUEST=405,
    DUPLICATE=409,
    INTERNAL_ERROR=500,
}
export default  statuscodes;