
class Global {

    static PROD_VAR = false;

    static BASE_PATH = Global.PROD_VAR ? "" : 'http://192.168.43.205:5000';

    static CHECK_LOGIN_URL = '/User/login';

    static CHECK_SIGNUP_URL = '/User/signup';

    static CHECK_OTP_URL = '/User/otp';

    static RESET_PASSWORD_URL = '/User/resetpass';




    static FETCH_DASHBOARD_OFFERS_URL = '/User/offers';

    static FETCH_RECOMMENDED_PRODUCTS_URL = '/User/recommendedfood';

    static FETCH_MOSTRATED_PRODUCTS_URL = '/User/toprated';

    static FETCH_VENDORLIST_URL = '/User/vendorlist';

    static FETCH_VENDOR_PRODUCT_LIST_URL = '/User/vendorProductList'

    static FETCH_DEALS_OF_DAY_LIST_URL = '/User/dealsofday'

    static SEND_PLACE_ORDER_URL = '/User/placeorder'


}

export default Global;

