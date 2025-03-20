import React, { Component } from "react";
import { connect } from "react-redux";
import { closeModal } from "../redux/slices/modalSlice";
import AddUserModalBody from "./AddUserModalBody";
import ConfirmationModalBody from "./ConfirmationModalBody";
import { MODAL_BODY_TYPES } from "../utils/globalConstantUtil";
import AddCommentModalBody from "./AddCommentModalBody";
import AssignTicketModalBody from "./AssignTicketModalBody";
import UpdateTicketStatus from "./UpdateTicketStatus";
import AddTicketModalBody from "./AddTicketModalBody";
import UpdateTicketModalBody from "./UpdateTicketModalBody";
import AutoAssignTicketModalBody from "./AutoAssignTicketModalBody";

class ModalLayout extends Component {
  close = (e) => {
    this.props.dispatch(closeModal(e));
  };

  render() {
    const { isOpen, bodyType, size, extraObject, title } = this.props.modal;

    return (
      <>
        <div className={`modal ${isOpen ? "modal-open" : ""}`}>
          <div className={`modal-box  ${size === "lg" ? "max-w-5xl" : ""}`}>
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => this.close()}
            >
              ✕
            </button>
            <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>

            {
              {
                [MODAL_BODY_TYPES.USER_ADD_NEW]: (
                  <AddUserModalBody
                    closeModal={this.close}
                    extraObject={extraObject}
                  />
                ),
                [MODAL_BODY_TYPES.ADD_COMMENT]: (
                  <AddCommentModalBody
                    closeModal={this.close}
                    extraObject={extraObject}
                  />
                ),
                [MODAL_BODY_TYPES.ASSIGN_TICKET]: (
                  <AssignTicketModalBody
                    closeModal={this.close}
                    extraObject={extraObject}
                  />
                ),
                [MODAL_BODY_TYPES.AUTO_ASSIGN_TICKET]: (
                  <AutoAssignTicketModalBody
                    closeModal={this.close}
                    extraObject={extraObject}
                  />
                ),
                [MODAL_BODY_TYPES.TICKET_STATUS_UPDATE]: (
                  <UpdateTicketStatus
                    closeModal={this.close}
                    extraObject={extraObject}
                  />
                ),

                [MODAL_BODY_TYPES.CONFIRMATION]: (
                  <ConfirmationModalBody
                    extraObject={extraObject}
                    closeModal={this.close}
                  />
                ),
                [MODAL_BODY_TYPES.TICKET_ADD_NEW]: (
                  <AddTicketModalBody
                    extraObject={extraObject}
                    closeModal={this.close}
                  />
                ),
                [MODAL_BODY_TYPES.TICKET_UPDATE]: (
                  <UpdateTicketModalBody
                    extraObject={extraObject}
                    closeModal={this.close}
                  />
                ),
                [MODAL_BODY_TYPES.DEFAULT]: <div></div>,
              }[bodyType]
            }
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  modal: state.modal,
});

export default connect(mapStateToProps)(ModalLayout);
