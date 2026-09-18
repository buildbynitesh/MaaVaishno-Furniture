import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { motion } from 'framer-motion'
import {
  FiEye,
  FiFilter,
} from 'react-icons/fi'

import { formatPrice } from '../../utils/helpers'

const STATUSES = [
  'all',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const STATUS_COLORS = {
  pending:
    'bg-amber-100 text-amber-700',

  processing:
    'bg-blue-100 text-blue-700',

  shipped:
    'bg-indigo-100 text-indigo-700',

  delivered:
    'bg-green-100 text-green-700',

  cancelled:
    'bg-red-100 text-red-700',
}

export default function OrderManagement() {

  const [orders, setOrders] = useState([])

  const [filter, setFilter] =
    useState('all')

  const [selectedOrder, setSelectedOrder] =
    useState(null)

  const [updatingId, setUpdatingId] =
    useState(null)

  // FETCH ORDERS
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data.orders || [])
    } catch (error) {
      console.log(error)
    }
  }

  // FILTERED ORDERS
  const filtered =
    filter === 'all'
      ? orders
      : orders.filter(
          (o) =>
            o.orderStatus === filter
        )

  // UPDATE STATUS
  const handleStatusChange =
    async (orderId, newStatus) => {

      try {

        setUpdatingId(orderId)

        await api.put(
          `/orders/${orderId}/status`,
          {
            orderStatus: newStatus,
          }
        )

        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? {
                  ...o,
                  orderStatus: newStatus,
                }
              : o
          )
        )

      } catch (error) {

        console.log(error)

      } finally {

        setUpdatingId(null)

      }
    }

  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

        <h2 className="font-display text-2xl text-bark font-semibold">

          Orders ({filtered.length})

        </h2>

        <div className="flex items-center gap-2">

          <FiFilter className="w-4 h-4 text-sand" />

          <div className="flex gap-1.5 flex-wrap">

            {STATUSES.map((s) => (

              <button
                key={s}
                onClick={() =>
                  setFilter(s)
                }
                className={`px-3 py-1.5 rounded-full font-body text-xs font-medium capitalize transition-all ${
                  filter === s
                    ? 'bg-bark text-cream'
                    : 'bg-cream text-bark/60 hover:text-bark'
                }`}
              >

                {s}

              </button>

            ))}

          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-cream/50">

              <tr>

                {[
                  'Order',
                  'Customer',
                  'Date',
                  'Amount',
                  'Items',
                  'Payment',
                  'Status',
                  'Action',
                ].map((h) => (

                  <th
                    key={h}
                    className="px-4 py-4 text-left font-body text-xs text-sand uppercase tracking-widest"
                  >

                    {h}

                  </th>

                ))}

              </tr>

            </thead>

            <tbody className="divide-y divide-sand/10">

              {filtered.map((order, i) => (

                <motion.tr
                  key={order._id}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  transition={{
                    delay: i * 0.04,
                  }}
                  className="hover:bg-cream/20 transition-colors"
                >

                  {/* ORDER ID */}
                  <td className="px-4 py-3.5 font-body text-sm font-semibold text-bark">

                    {order._id}

                  </td>

                  {/* CUSTOMER */}
                  <td className="px-4 py-3.5">

                    <p className="font-body text-sm font-medium text-bark">

                      {order.user?.name ||
                        'Customer'}

                    </p>

                    <p className="font-body text-xs text-sand">

                      {order.user?.email}

                    </p>

                  </td>

                  {/* DATE */}
                  <td className="px-4 py-3.5 font-body text-sm text-bark/60">

                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      'en-IN',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    )}

                  </td>

                  {/* AMOUNT */}
                  <td className="px-4 py-3.5 font-display text-sm font-bold text-bark">

                    {formatPrice(
                      order.totalAmount
                    )}

                  </td>

                  {/* ITEMS */}
                  <td className="px-4 py-3.5 font-body text-sm text-bark/70 text-center">

                    {order.items?.length || 0}

                  </td>

                  {/* PAYMENT */}
                  <td className="px-4 py-3.5">

                    <span
                      className={`px-2.5 py-1 rounded-full font-body text-xs font-semibold capitalize ${
                        order.paymentMethod ===
                        'razorpay'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >

                      {order.paymentMethod ===
                      'razorpay'
                        ? 'Online'
                        : 'COD'}

                    </span>

                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3.5">

                    <div className="relative">

                      {updatingId ===
                      order._id ? (

                        <span className="w-4 h-4 border-2 border-wood/40 border-t-wood rounded-full animate-spin inline-block" />

                      ) : (

                        <select
                          value={
                            order.orderStatus
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className={`appearance-none pr-6 pl-2.5 py-1 rounded-full font-body text-xs font-semibold capitalize border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-wood/30 ${
                            STATUS_COLORS[
                              order
                                .orderStatus
                            ] ||
                            'bg-sand/30 text-bark'
                          }`}
                        >

                          {STATUSES.filter(
                            (s) =>
                              s !== 'all'
                          ).map((s) => (

                            <option
                              key={s}
                              value={s}
                              className="capitalize bg-white text-bark"
                            >

                              {s}

                            </option>

                          ))}

                        </select>

                      )}

                    </div>

                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3.5">

                    <button
                      onClick={() =>
                        setSelectedOrder(
                          order
                        )
                      }
                      className="p-2 text-sand hover:text-wood hover:bg-cream rounded-lg transition-colors"
                    >

                      <FiEye className="w-4 h-4" />

                    </button>

                  </td>

                </motion.tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}
        {filtered.length === 0 && (

          <div className="text-center py-12">

            <p className="font-display text-xl text-bark mb-2">

              No orders found

            </p>

            <p className="font-body text-sm text-sand">

              No orders available yet

            </p>

          </div>

        )}

      </div>

      {/* MODAL */}
      {selectedOrder && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div className="absolute inset-0 bg-bark/40 backdrop-blur-sm" />

          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            className="relative bg-linen rounded-2xl shadow-luxury p-6 max-w-md w-full"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <h3 className="font-display text-xl text-bark font-semibold mb-4">

              Order Details

            </h3>

            <div className="space-y-3">

              <div className="flex justify-between">

                <span className="font-body text-sm text-sand">

                  Customer

                </span>

                <span className="font-body text-sm text-bark font-medium">

                  {
                    selectedOrder.user
                      ?.name
                  }

                </span>

              </div>

              <div className="flex justify-between">

                <span className="font-body text-sm text-sand">

                  Amount

                </span>

                <span className="font-display text-bark font-bold">

                  {formatPrice(
                    selectedOrder.totalAmount
                  )}

                </span>

              </div>

              <div className="flex justify-between">

                <span className="font-body text-sm text-sand">

                  Items

                </span>

                <span className="font-body text-sm text-bark">

                  {
                    selectedOrder.items
                      ?.length
                  }{' '}
                  products

                </span>

              </div>

              <div className="flex justify-between">

                <span className="font-body text-sm text-sand">

                  Payment

                </span>

                <span className="font-body text-sm text-bark capitalize">

                  {
                    selectedOrder.paymentMethod
                  }

                </span>

              </div>

              <div className="flex justify-between items-center">

                <span className="font-body text-sm text-sand">

                  Status

                </span>

                <span
                  className={`px-3 py-1 rounded-full font-body text-xs font-semibold capitalize ${
                    STATUS_COLORS[
                      selectedOrder
                        .orderStatus
                    ]
                  }`}
                >

                  {
                    selectedOrder.orderStatus
                  }

                </span>

              </div>

            </div>

            <button
              onClick={() =>
                setSelectedOrder(null)
              }
              className="mt-6 w-full btn-outline text-sm"
            >

              Close

            </button>

          </motion.div>

        </div>

      )}

    </div>
  )
}