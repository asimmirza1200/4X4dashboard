import {
  Document,
  Font,
  Image,
  // Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import logo from "@/assets/img/logo/logo.png";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});
Font.register({
  family: "DejaVu Sans",
  fonts: [
    {
      src: "https://kendo.cdn.telerik.com/2017.2.621/styles/fonts/DejaVu/DejaVuSans.ttf",
    },
    {
      src: "https://kendo.cdn.telerik.com/2017.2.621/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    paddingTop: 30,
    paddingLeft: 10,
    paddingRight: 29,
    lineHeight: 1.5,
  },
  table: {
    display: "table",
    width: "auto",
    color: "#4b5563",
    marginRight: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginTop: 0,
    borderRadius: "8px",
    borderColor: "#e9e9e9",
    borderStyle: "solid",
    borderWidth: 0.5,
    padding: 0,
    textAlign: "left",
  },
  tableRow: {
    // margin: 'auto',
    flexDirection: "row",
    paddingBottom: 2,
    paddingTop: 2,
    textAlign: "left",
    borderWidth: 0.8,
    borderColor: "#E5E7EB",
    borderBottom: "0",
  },
  tableRowHeder: {
    // margin: 'auto',
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingBottom: 4,
    paddingTop: 4,
    paddingLeft: 0,
    borderBottomWidth: 0.8,
    borderColor: "#E5E7EB",
    borderStyle: "solid",
    textTransform: "uppercase",
    textAlign: "left",
  },
  tableCol: {
    width: "25%",
    textAlign: "left",

    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderLeftWidth: 0.5,
    // borderTopWidth: 0.5,
    // borderBottomWidth: 0.5,
    // borderColor: '#d1d5db',
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    // textAlign:'center',
    paddingLeft: "0",
    paddingRight: "0",
    marginLeft: "13",
    marginRight: "13",
  },

  tableCellQuantity: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    textAlign: "center",
    paddingLeft: "0",
    paddingRight: "0",
    marginLeft: "12",
    marginRight: "12",
  },

  invoiceFirst: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 18,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottom: 1,
    borderColor: "#f3f4f6",
    // backgroundColor:'#EEF2FF',
  },
  invoiceSecond: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 12,
    marginLeft: "13",
    marginRight: "13",
  },
  invoiceThird: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderTop: 1,
    borderColor: "#ffffff",
    backgroundColor: "#f4f5f7",
    borderRadius: 12,
    marginLeft: "13",
    marginRight: "13",

    // backgroundColor:'#F2FCF9',
  },
  logo: {
    width: 64,
    height: 25,
    bottom: 5,
    right: 10,
    marginBottom: 10,
    textAlign: "right",
    color: "#4b5563",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 10.3,

    marginRight: "39%",
    textTransform: "uppercase",
  },
  title: {
    color: "#2f3032",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 8.1,
    textTransform: "uppercase",
  },
  info: {
    fontSize: 9,
    color: "#6b7280",
  },
  infoCost: {
    fontSize: 10,
    color: "#6b7280",
    marginLeft: "4%",
    marginTop: "7px",
    textAlign: "left",
    width: "25%",
  },
  invoiceNum: {
    fontSize: 9,
    color: "#6b7280",
    marginLeft: "6%",
  },
  topAddress: {
    fontSize: 10,
    color: "#6b7280",
    width: "100%",
    marginRight: "62%",
    textAlign: "right",
    whiteSapce: "nowrap",
  },
  amount: {
    fontSize: 10,
    color: "#ef4444",
  },
  totalAmount: {
    fontSize: 10,
    color: "#ef4444",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "right",
  },
  status: {
    color: "#10b981",
  },
  quantity: {
    color: "#1f2937",
    textAlign: "center",
  },
  itemPrice: {
    color: "#1f2937",
    textAlign: "left",
  },
  header: {
    color: "#6b7280",
    fontSize: 9,
    fontFamily: "Open Sans",
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "left",
  },

  thanks: {
    color: "#22c55e",
  },
  infoRight: {
    textAlign: "right",
    fontSize: 9,
    color: "#6b7280",
    width: "25%",
    marginRight: "39%",
    fontFamily: "Open Sans",
  },
  titleRight: {
    textAlign: "right",
    fontFamily: "Open Sans",
    fontWeight: "bold",
    fontSize: 8.1,
    width: "25%",
    marginRight: "39%",
    textTransform: "uppercase",
    color: "#2f3032",
  },
  topBg: {
    // backgroundColor:'#EEF2FF',
  },
  invoiceDiv: {
    alignItems: "baseline",
  },
});

const InvoiceForDownload = ({
  data,
  currency,
  globalSetting,
  showDateFormat,
  getNumberTwo,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.invoiceFirst}>
            <View style={styles.invoiceDiv}>
              <Text
                style={{
                  fontFamily: "Open Sans",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  fontSize: 20,
                  color: "#1f2937"
                }}
              >
                {t("invoice")}
              </Text>
              <Text style={[styles.info, { marginTop: 4 }]}>
                {t("InvoiceStatus")}
                <Text style={{ 
                  color: data?.status === "Delivered" ? "#22c55e" : 
                         data?.status === "Cancel" || data?.status === "Deleted" ? "#f43f5e" :
                         data?.status === "Processing" ? "#14b8a6" : "#eab308",
                  fontWeight: "medium",
                  textTransform: "capitalize"
                }}>
                  {" "}{data?.status}
                </Text>
              </Text>
              <View style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>
                  Payment Status:
                </Text>
                <View style={{
                  backgroundColor: "#22c55e", 
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 2,
                  marginLeft: 4,
                  display: "inline-block"
                }}>
                  <Text style={{ 
                    color: "#ffffff",
                    fontWeight: "medium",
                    fontSize: 10,
                    textTransform: "capitalize"
                  }}>
                    {" "}{data?.paymentStatus?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "right",
                  marginBottom: 8,
                  fontFamily: "Open Sans"
                }}
              >
                <Image
                  src={logo}
                  alt="all4x4"
                  style={{
                    width: 110,
                  }}
                />
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  textAlign: "right",
                  lineHeight: 1.5
                }}
              >
                {globalSetting?.address}
                {"\n"}
                {globalSetting?.contact}
                {"\n"}
                {globalSetting?.email}
                {"\n"}
                {globalSetting?.website}
              </Text>
            </View>
          </View>

          <View style={styles.invoiceSecond}>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={[styles.title, { fontSize: 12, color: "#6b7280" }]}>
                {t("InvoiceDate")}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  textAlign: "left",
                  marginTop: 4
                }}
              >
                {data?.createdAt !== undefined && (
                  <Text>{showDateFormat(data?.createdAt)}</Text>
                )}
              </Text>
            </View>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={[styles.title, { fontSize: 12, color: "#6b7280" }]}>
                {t("InvoiceNo")}
              </Text>
              <Text style={{
                fontSize: 14,
                color: "#6b7280",
                textAlign: "left",
                marginTop: 4
              }}>
                #{data?.invoice}
              </Text>
            </View>

            <View style={{ width: "50%", alignItems: "flex-end" }}>
              <Text style={[styles.title, { fontSize: 12, color: "#6b7280", textAlign: "right" }]}>
                {t("InvoiceTo")}
              </Text>
              <Text style={{
                fontSize: 14,
                color: "#6b7280",
                textAlign: "right",
                marginTop: 4,
                lineHeight: 1.4
              }}>
                {data?.user_info?.name}
                {"\n"}
                {data?.user_info?.email}{" "}{data?.user_info?.contact}
                {"\n"}
                {data?.user_info?.address?.substring(0, 30)}
                {"\n"}
                {data?.user_info?.city}, {data?.user_info?.country}, {data?.user_info?.zipCode}
              </Text>
            </View>
          </View>

          <View style={styles.table}>
            <View style={styles.tableRowHeder}>
              <View style={[styles.tableCol, { width: "10%" }]}>
                <Text style={styles.tableCell}>
                  <Text style={styles.header}>{t("Sr")}</Text>
                </Text>
              </View>
              <View style={[styles.tableCol, { width: "40%" }]}>
                <Text style={styles.tableCell}>
                  <Text style={styles.header}>Product Title</Text>
                </Text>
              </View>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}>
                  <Text style={[styles.header, { textAlign: "center" }]}>
                    {t("Quantity")}
                  </Text>
                </Text>
              </View>
              <View style={[styles.tableCol, { width: "15%" }]}>
                <Text style={styles.tableCell}>
                  <Text style={[styles.header, { textAlign: "center" }]}>
                    {t("ItemPrice")}
                  </Text>
                </Text>
              </View>

              <View style={[styles.tableCol, { width: "20%" }]}>
                <Text style={styles.tableCell}>
                  <Text style={[styles.header, { textAlign: "right" }]}>
                    {t("Amount")}
                  </Text>
                </Text>
              </View>
            </View>
            {data?.cart?.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "10%" }]}>
                  <Text style={styles.tableCell}>
                    {i + 1}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "40%" }]}>
                  <Text style={styles.tableCell}>
                    {item.title?.substring(0, 50)}
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text style={[styles.tableCellQuantity, { textAlign: "center" }]}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Open Sans",
                      }}
                    >
                      {item.quantity}
                    </Text>
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "15%" }]}>
                  <Text style={[styles.tableCell, { textAlign: "center" }]}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        fontFamily: "Open Sans",
                      }}
                    >
                      {currency}
                      {getNumberTwo(item.price)}
                    </Text>
                  </Text>
                </View>

                <View style={[styles.tableCol, { width: "20%" }]}>
                  <Text style={[styles.tableCell, { textAlign: "right" }]}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#ef4444",
                        fontWeight: "bold",
                        fontFamily: "Open Sans",
                      }}
                    >
                      {currency}
                      {getNumberTwo(item.price * item.quantity)}
                    </Text>
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.invoiceThird}>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={[styles.title, { fontSize: 12, color: "#6b7280" }]}>
                {t("InvoicepaymentMethod")}
              </Text>
              <Text style={{ fontSize: 14, color: "#0e9f6e", marginTop: 4 }}>
                {data?.paymentMethod}
              </Text>
              
              {data?.stripePaymentIntentId && (
                <Text style={{ fontSize: 10, color: "#6b7280", marginTop: 1 }}>
                  Trans ID: {data?.stripePaymentIntentId}
                </Text>
              )}
            </View>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={[styles.title, { fontSize: 12, color: "#6b7280" }]}>
                {t("ShippingCost")}
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                {currency}
                {getNumberTwo(data?.shippingCost)}
              </Text>
            </View>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={[styles.title, { fontSize: 12, color: "#6b7280" }]}>
                {t("InvoiceDicount")}
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                {currency}
                {getNumberTwo(data?.discount)}
              </Text>
            </View>
            <View style={{ width: "25%", alignItems: "baseline" }}>
              <Text style={[styles.title, { fontSize: 12, color: "#6b7280" }]}>
                {t("InvoiceTotalAmount")}
              </Text>
              <Text style={{ fontSize: 20, color: "#ef4444", fontWeight: "bold", marginTop: 4 }}>
                {currency}
                {getNumberTwo(data?.total)}
              </Text>
            </View>
          </View>

          {/* Payment Details Section */}
          {data?.paymentStatus && (
            <View style={{
              marginTop: 20,
              paddingTop: 15,
              borderTop: 1,
              borderColor: "#e5e7eb",
              paddingLeft: 13,
              paddingRight: 13
            }}>
              <Text style={[styles.title, { fontSize: 9, marginBottom: 8 }]}>
                Payment Details
              </Text>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap"
              }}>
                <View style={{ width: "50%", marginBottom: 5 }}>
                  <Text style={{ fontSize: 8, color: "#6b7280" }}>
                    Payment Date:
                  </Text>
                  <Text style={{ fontSize: 9, color: "#374151" }}>
                    {data?.paymentDate ? 
                      new Date(data.paymentDate).toLocaleDateString() : 
                      "Pending"
                    }
                  </Text>
                </View>
                {data?.paymentStatus && (
                <View style={{
                  backgroundColor: "#22c55e", 
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 3,
                  marginTop: 2,
                  alignSelf: "flex-start"
                }}>
                  <Text style={{ 
                    fontSize: 10, 
                    color: "#ffffff",
                    fontWeight: "medium"
                  }}>
                    Status: {data?.paymentStatus?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Text>
                </View>
              )}
                {data?.paymentAmount && (
                  <View style={{ width: "50%", marginBottom: 5 }}>
                    <Text style={{ fontSize: 8, color: "#6b7280" }}>
                      Paid Amount:
                    </Text>
                    <Text style={{ fontSize: 9, color: "#374151" }}>
                      {currency}{getNumberTwo(data.paymentAmount)}
                    </Text>
                  </View>
                )}
                {data?.refundAmount && data.refundAmount > 0 && (
                  <View style={{ width: "100%", marginTop: 8 }}>
                    <Text style={{ fontSize: 8, color: "#6b7280", marginBottom: 3 }}>
                      Refund Information:
                    </Text>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={{ fontSize: 8, color: "#374151" }}>
                        Refund Amount: {currency}{getNumberTwo(data.refundAmount)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </Page>
      </Document>
    </>
  );
};

export default InvoiceForDownload;
